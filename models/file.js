import mongoose from "mongoose";

const File = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    password: String,
    downloadCount: {
        default: 0,
        required: true,
        type: Number
    }
})

export const FileModel = mongoose.model("File", File)