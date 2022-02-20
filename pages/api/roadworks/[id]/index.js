import { getSession } from 'next-auth/react'

import RequestModel from '../../../../models/Request'
import UserModel from '../../../../models/User'

import { 
    isAcceptByRole, 
    isOwnerDataSession, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    trimBody,
    dateFormatFromISO } from '../../../../lib/functions'

const getRoadwork = async (req, res) => {

    // if (!isAcceptByRole(await getSession({ req }))) 
    //     throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;

    if (!id) generateApiError('Не указан id', 400);

    let work, data = null;

    try {
        work = await RequestModel.findOne({ _id: id });
    } catch (err) {
        throw generateApiError('Неверно указан id', 400);
    }

    if (work) data = {
        id: work._id,
        executorId: work.executorId,
        executorName: work.executorName,
        status: work.status,
        adress: work.adress,
        dateStart: dateFormatFromISO(work.dateOfStart?.toISOString()),
        dateEnd: dateFormatFromISO(work.dateOfEnd?.toISOString())
    }

    return sendJson(res, 200, data);
}

const editRoadwork = async (req, res) => {
    const session = await getSession({ req });
    if (!isAcceptByRole(session)) 
        throw generateApiError('Доступ запрещен', 403);

    if (!req.body) throw generateApiError('Запрос с пустым body', 400);

    trimBody(req);

    const { id } = req.query;
    if (!id) generateApiError('Не указан id', 400);

    let { coordinates, executorId, adress, dateStart, dateEnd, comment } = req.body;

    if (!coordinates 
        || !executorId 
        || !adress 
        || !dateStart 
        || !dateEnd) return notSuccess200Json(res, 'Пожалуйста, заполните все поля');

    let request = await RequestModel.findById(id);

    if (!isOwnerDataSession(
        session,
        request.customerId)) 
            throw generateApiError('Доступ запрещен', 403);

    if (request.status === 'accepted') return notSuccess200Json(res, 'Нельзя изменять принятые заявки');
    
    let executor = await UserModel.findById(executorId);

    if (!executor)
        return notSuccess200Json(res, 'Такого исполнителя не существует');

    coordinates = JSON.parse(coordinates);

    if (!coordinates || coordinates.length == 0)
        return notSuccess200Json(res, 'Координаты проведения работ не указаны или указаны неверно');

    dateStart = Date.parse(dateStart);
    dateEnd = Date.parse(dateEnd);

    if (!dateStart || !dateEnd || isNaN(dateStart) || isNaN(dateEnd))
        return notSuccess200Json(res, 'Неверный формат даты');

    if (dateStart > dateEnd)
        return notSuccess200Json(res, 'Дата окончания проведения работы должна быть позже даты начала');

    request.executorId = executor.id;
    request.executorName = executor.company;
    request.coordinates = coordinates;
    request.adress = adress;
    request.comment = comment;
    request.status = 'new';
    request.dateOfStart = dateStart;
    request.dateOfEnd = dateEnd;

    await request.save();

    return sendJson(res, 200, null, 'Аккаунт успешно изменен!');
}

const deleteRoadwork = async (req, res) => {
    
    if (!isAcceptByRole(await getSession({ req })))
        throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;
    if (!id) generateApiError('Не указан id', 400);

    await RequestModel.findByIdAndRemove(id)

    return sendJson(res, 200);
}

const roadworksHandler = async (req, res) => {
    try {

        switch(req.method) {
            case 'GET': {
                return await getRoadwork(req, res);
            }
            case 'POST': {
                return editRoadwork(req, res);
            }
            case 'DELETE': {
                return await deleteRoadwork(req, res);
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default roadworksHandler