import mongoose from 'mongoose'

import dbConnect from '../lib/mongoose'
(async () => await dbConnect())(); 

const GradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Пожалуйста, объявите имя шкалы'],
        maxlength: [30, 'Название шкалы не может быть больше 30 символов'],
    },
    value: {
        type: Number,
        required: [true, 'Пожалуйста, объявите значение шкалы'],
    },
})

export default mongoose.models.Grade || mongoose.model('Grade', GradeSchema)
