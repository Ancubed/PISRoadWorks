import mongoose from 'mongoose'
import { RoleSchema } from './Role'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Пожалуйста, объявите email пользователя'],
        maxlength: [40, 'Email пользователя не может быть больше 40 символов'],
    },
    name: {
        type: String,
        required: [true, 'Пожалуйста, объявите имя пользователя'],
        maxlength: [30, 'Имя пользователя не может быть больше 30 символов'],
    },
    company: {
        type: String,
        required: [true, 'Пожалуйста, объявите название компании'],
        maxlength: [30, 'Название компании не может быть больше 30 символов'],
    },
    role: RoleSchema,
    password: {
        type: String,
        required: [true, 'Пожалуйста, объявите пароль пользователя'],
        maxlength: [100, 'Пароль компании не может быть больше 30 символов'],
    },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
