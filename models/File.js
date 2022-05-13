import mongoose from 'mongoose'

import dbConnect from '../lib/mongoose'
(async () => await dbConnect())(); 

export const FileSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    filename: String,
})

export default mongoose.models.File || mongoose.model('File', FileSchema)
