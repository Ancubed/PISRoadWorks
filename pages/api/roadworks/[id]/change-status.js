import { getSession } from 'next-auth/react'

import RequestModel from '../../../../models/Request'
import UserModel from '../../../../models/User'

import { REQUEST_STATUS_ENUM } from '../../../../lib/constants'

import { 
    isSession,
    isAcceptByRole, 
    isOwnerDataSession, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    trimBody,
    dateFormatFromISO } from '../../../../lib/functions'

const changeRoadworkStatus = async (req, res) => {
    const session = await getSession({ req })
    if (!isSession(session)) 
        throw generateApiError('Доступ запрещен', 403)

    if (!req.body) throw generateApiError('Запрос с пустым body', 400)

    trimBody(req)

    const { id } = req.query
    if (!id) throw generateApiError('Не указан id', 400)

    let { comment, status } = req.body

    if (!status) throw generateApiError('Заполните поле статус', 400)

    if (!Object.keys(REQUEST_STATUS_ENUM).includes(status)) throw generateApiError('Передан некорректный статус заявки', 400)

    let request = await RequestModel.findById(id)

    if (!request) throw generateApiError('Заявка не найдена', 400)

    if (!isAcceptByRole(session, [0, 1]) && !isOwnerDataSession(
        session,
        request.customerId)) 
            throw generateApiError('Доступ запрещен', 403)

    if (status === 'rejected' && comment) request.rejectComment = comment;
    request.status = status;

    await request.save()

    return sendJson(res, 200, null, 'Заявка успешно изменена!')
}

const changeRoadworksStatusHandler = async (req, res) => {
    try {

        switch(req.method) {
            case 'POST': {
                return await changeRoadworkStatus(req, res)
            }
            default:
                res.setHeader('Allow', ['POST'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default changeRoadworksStatusHandler