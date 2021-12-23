import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Пожалуйста, передайте email пользователя'],
      maxlength: [40, 'Email пользователя не может быть больше 40 символов'],
    },
    name: {
      type: String,
      required: [true, "Пожалуйста, передайте имя пользователя"],
      maxlength: [30, "Имя пользователя не может быть больше 30 символов"],
    },
    company: {
      type: String,
      required: [true, 'Пожалуйста, передайте название компании'],
      maxlength: [30, 'Название компании не может быть больше 30 символов'],
    },
    role: {
        type: String,
        required: [true, 'Пожалуйста, передайте тип компании'],
        maxlength: [15, 'Тип компании не может быть больше 30 символов'],
    },
    password: {
        type: String,
        required: [true, 'Пожалуйста, передайте пароль пользователя'],
        maxlength: [100, 'Пароль компании не может быть больше 30 символов'],
    }
  })
  
  export default mongoose.models.User || mongoose.model('User', UserSchema)