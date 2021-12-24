import mongoose from 'mongoose';

const GradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Пожалуйста, передайте имя шкалы"],
        maxlength: [30, "Название шкалы не может быть больше 30 символов"]
    },
    value: {
      type: Number,
      required: [true, 'Пожалуйста, передайте значение шкалы']
    }
  })
  
  export default mongoose.models.Grade || mongoose.model('Grade', GradeSchema)