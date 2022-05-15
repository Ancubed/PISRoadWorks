import multer from 'multer'
import path from 'path'
import fs from 'fs'

import { getSession } from 'next-auth/react'

import GridFS from '../../../models/GridFS'
import RequestModel from '../../../models/Request'

import { MAX_FILES_COUNT } from '../../../lib/constants'

import { 
    isSession,
    isAcceptByRole, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    middlewareWrapper,
    getRandomInt } from '../../../lib/functions'

const acceptedMimeTypes = /\.(doc|docx|odt|pdf)/;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', '..', '..', 'tmp'))
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${getRandomInt()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (acceptedMimeTypes.test(path.extname(file.originalname))) {
        cb(null, true)
    } else {
        cb(createError(400, `Запрещенный формат файла. Разрешено загружать только файлы следующих форматов: ${acceptedMimeTypes}`));
    }
}

const limits = {
    fileSize: 100000,
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

const attachFileToRoadworks = async (res, roadwork, files) => {
    try {
        let request = await RequestModel.findById(roadwork)
        if (!request) throw generateApiError('Заявка не найдена', 500)
        let newFiles = [...(request.files || []), ...files]
        if (newFiles.length > MAX_FILES_COUNT) {
            let removeFilesPromise = files.map(file => {
                return GridFS.delete(file._id)
            })
            await Promise.all(removeFilesPromise)
            throw generateApiError('Превышен лимит количества файлов', 400)
        }
        request.status = 'submitted'
        request.files = newFiles
        await request.save()

        return sendJson(res, 200, {
            status: 'submitted',
            files: files
        })
    } catch (err) {
        // Удалить файлы из gridfs в случае ошибки добавления к заявке
        // throw err
        throw err //new Error('Ошибка при прикреплении файлов к заявке')
    }
}

const filesUploadHandler = async (req, res) => {
    await middlewareWrapper(req, res, upload.array('files', MAX_FILES_COUNT))

    const { files } = req
    const { roadwork } = req.query

    if (!files || files.length == 0) throw generateApiError('Файлы не прикреплены', 400);

    let filesPromises = files.map(file => {
        let readStream = fs.createReadStream(path.join(__dirname, '..', '..', '..', '..', 'tmp', file.filename))
        return GridFS.upload(file.originalname, readStream, {
            encoding: file.encoding,
            mimetype: file.mimetype
        })
    })
    
    let uploadedFiles = await Promise.all(filesPromises)

    if (roadwork) {
        return await attachFileToRoadworks(res, roadwork, uploadedFiles);
    }
    
    sendJson(res, 200)
}

const filesHandler = async (req, res) => {
    try {

        const session = await getSession({ req });

        if (!isSession(session))
            throw generateApiError('Доступ запрещен', 403);

        switch(req.method) {
            case 'POST': {
                return await filesUploadHandler(req, res);
            }
            default:
                res.setHeader('Allow', ['POST'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default filesHandler

export const config = {
    api: {
        bodyParser: false,
    }
};