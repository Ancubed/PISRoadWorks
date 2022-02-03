import mongoose from 'mongoose'

const RequestSchema = new mongoose.Schema({
    executorId: {
        type: mongoose.ObjectId,
        required: [true, 'Пожалуйста, передайте id компании-исполнителя'],
    },
    customerId: {
        type: mongoose.ObjectId,
        required: [true, 'Пожалуйста, передайте id компании-заказчика'],
    },
    executorName: {
        type: String,
        required: [true, 'Пожалуйста, передайте имя компании-исполнителя'],
        maxlength: [
            40,
            'Имя компании-исполнителя не может быть больше 40 символов',
        ],
    },
    adress: {
        type: String,
        required: [true, 'Пожалуйста, передайте адрес проведения работ'],
        maxlength: [
            256,
            'Адрес компании-исполнителя не может быть больше 256 символов',
        ],
    },
    status: {
        type: String,
        enum: ['new', 'submitted', 'rejected', 'accepted'],
        required: [true, 'Пожалуйста, передайте статус работы'],
    },
    files: {
        type: [
            {
                number: Number,
                url: String,
            },
        ],
        default: undefined,
    },
    comment: {
        type: String,
        maxlength: [256, 'Комментарий не может быть больше 256 символов'],
    },
    coordinates: {
        type: Array,
    },
    dateOfSubmission: {
        type: Date,
    },
    dateOfStart: {
        type: Date,
        required: [true, 'Пожалуйста, передайте дату начала работ'],
    },
    dateOfEnd: {
        type: Date,
        required: [true, 'Пожалуйста, передайте дату окончания работ'],
    },
})

export default mongoose.models.Request ||
    mongoose.model('Request', RequestSchema)
