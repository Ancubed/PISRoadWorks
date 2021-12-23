import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    companyName: {
      type: String,
      required: [true, 'Пожалуйста, передайте имя компании-исполнителя'],
      maxlength: [40, 'Имя компании-исполнителя не может быть больше 40 символов'],
    },
    companyId: {
      type: String,
      required: [true, "Пожалуйста, передайте id компании-исполнителя"],
      maxlength: [100, "Id компании-исполнителя не может быть больше 100 символов"],
    },
    status: {
      type: String,
      required: [true, 'Пожалуйста, передайте статус работы'],
      maxlength: [30, 'статус работы не может быть больше 30 символов'],
    }
})
  
export default mongoose.models.Request || mongoose.model('Request', RequestSchema)