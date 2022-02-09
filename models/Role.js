import mongoose from 'mongoose'

export const RoleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'Пожалуйста, объявите id типа компании'],
        enum: [0, 1, 2],
        default: 2,
    },
    name: {
        type: String,
        required: [true, 'Пожалуйста, объявите название типа компании'],
        enum: ['Администратор', 'Заказчик', 'Исполнитель'],
        default: 'Исполнитель',
    },
})

export default mongoose.models.Role || mongoose.model('Role', RoleSchema)
