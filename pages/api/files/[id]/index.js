import { getSession } from 'next-auth/react'

import GridFS from '../../../../models/GridFS'
import RequestModel from '../../../../models/Request'

import { 
    isSession,
    isAcceptByRole, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    middlewareWrapper,
    getRandomInt } from '../../../../lib/functions'

const detachFileFromRoadworks = async (res, roadwork, filesId) => {
    let request = await RequestModel.findById(roadwork)
    if (!request) throw generateApiError('Заявка не найдена', 500)
    let requestFiles = request.files
    if (requestFiles && requestFiles.length > 0) {
        request.files = requestFiles.filter(files => !filesId.includes(files._id.toString()))
        request.save()
    }
    sendJson(res, 200)
}

const filesDownloadHandler = async (req, res) => {
    const { id } = req.query;

    if (!id) throw generateApiError('Не указан id', 400);

    await GridFS.download(id, res)
}

const filesDeleteHandler = async (req, res) => {
    const { id } = req.query;

    if (!id) throw generateApiError('Не указан id', 400);

    let { filesId, roadwork } = req.body;
    let removeError = null

    if (!filesId || filesId.length == 0) throw generateApiError('Не указаны id файлов для удаления', 400);

    try {
        let removeFilesPromise = filesId.map(fileId => {
            return GridFS.delete(fileId)
        })
        await Promise.all(removeFilesPromise)   
    } catch(err) {
        removeError = err
    }

    if (roadwork) {
        return await detachFileFromRoadworks(res, roadwork, filesId);
    }

    if (!roadwork && removeError) throw removeError
    
    sendJson(res, 200)
}

const filesHandler = async (req, res) => {
    try {

        const session = await getSession({ req });

        if (!isSession(session))
            throw generateApiError('Доступ запрещен', 403);

        switch(req.method) {
            case 'GET': {
                return await filesDownloadHandler(req, res);
            }
            case 'DELETE': {
                return await filesDeleteHandler(req, res)
            }
            default:
                res.setHeader('Allow', ['GET', 'DELETE'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default filesHandler