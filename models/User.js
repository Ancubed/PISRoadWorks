import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema({
    
});

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
    role: {
        id: {
            type: Number,
            required: [true, 'Пожалуйста, объявите id типа компании'],
            enum: [0, 1, 2],
            default: 2
        },
        name: {
            type: String,
            required: [true, 'Пожалуйста, объявите название типа компании'],
            enum: ['Администратор', 'Заказчик', 'Исполнитель'],
            default: 'Исполнитель'
        }
    },
    password: {
        type: String,
        required: [true, 'Пожалуйста, объявите пароль пользователя'],
        maxlength: [100, 'Пароль компании не может быть больше 30 символов'],
    },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
