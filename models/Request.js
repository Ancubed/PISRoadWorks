import mongoose from 'mongoose'
import { FileSchema } from './File'

import { REQUEST_STATUS_ENUM } from '../lib/constants' 

import dbConnect from '../lib/mongoose'
(async () => await dbConnect())(); 

const RequestSchema = new mongoose.Schema({
    executorId: {
        type: mongoose.ObjectId,
        required: [true, 'Пожалуйста, объявите id компании-исполнителя'],
    },
    customerId: {
        type: mongoose.ObjectId,
        required: [true, 'Пожалуйста, объявите id компании-заказчика'],
    },
    executorName: {
        type: String,
        required: [true, 'Пожалуйста, объявите имя компании-исполнителя'],
        maxlength: [
            40,
            'Имя компании-исполнителя не может быть больше 40 символов',
        ],
    },
    adress: {
        type: String,
        required: [true, 'Пожалуйста, объявите адрес проведения работ'],
        maxlength: [
            256,
            'Адрес компании-исполнителя не может быть больше 256 символов',
        ],
    },
    status: {
        type: String,
        enum: Object.keys(REQUEST_STATUS_ENUM),
        required: [true, 'Пожалуйста, объявите статус работы'],
    },
    files: [{ 
        type: FileSchema, 
        default: undefined 
    }],
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
        required: [true, 'Пожалуйста, объявите дату начала работ'],
    },
    dateOfEnd: {
        type: Date,
        required: [true, 'Пожалуйста, объявите дату окончания работ'],
    },
})

export default mongoose.models.Request ||
    mongoose.model('Request', RequestSchema)
