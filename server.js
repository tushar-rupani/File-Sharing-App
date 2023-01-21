import express, { urlencoded } from "express"
import multer from "multer";
import dotenv from "dotenv"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { FileModel } from "./models/file.js";
const app = express()
app.use(bodyParser.urlencoded({extended: false}))
const upload = multer({dest: "upload"})
dotenv.config();
app.set("view engine", "ejs");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL)

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/upload", upload.single("file"), async(req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if(req.body.password !=null && req.body.password != ""){
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }
    const file = await FileModel.create(fileData)
    console.log(file);
    res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`})
    
})

app.route("/file/:id").get(handleCheck).post(handleCheck)


async function handleCheck(req, res){
    const file = await FileModel.findById(req.params.id);
    if(file.password != null){
        if(req.body.password == null){
            res.render("password")
            return
        }
        if(!(await bcrypt.compare(req.body.password, file.password))){
            res.render("password", {error: true})
            return
        }
    }
    file.downloadCount++;
    await file.save();
    res.download(file.path, file.originalName)
}
app.listen(process.env.PORT)