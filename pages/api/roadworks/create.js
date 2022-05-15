import { getSession } from 'next-auth/react'

import UserModel from '../../../models/User'
import RequestModel from '../../../models/Request'

import { isAcceptByRole, sendJson, notSuccess200Json, generateApiError, catchApiError, trimBody } from '../../../lib/functions'

const createRoadworks = async (req, res) => {

    const session = await getSession({ req });

    if (!isAcceptByRole(session, [0, 1])) 
        throw generateApiError('Доступ запрещен', 403);

    if (!req.body) throw generateApiError('Запрос с пустым body', 400);

    trimBody(req);

    let { coordinates, executorId, adress, dateStart, dateEnd, comment } = req.body;

    if (!coordinates 
        || !executorId 
        || !adress 
        || !dateStart 
        || !dateEnd) return notSuccess200Json(res, 'Пожалуйста, заполните все поля');
    
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

    await (new RequestModel({
        executorId: executorId,
        customerId: session.user.id,
        executorName: executor.company,
        adress: adress,
        status: 'new',
        comment: comment,
        rejectComment: '',
        coordinates: coordinates,
        dateOfSubmission: new Date(),
        dateOfStart: dateStart,
        dateOfEnd: dateEnd
    })).save();

    return sendJson(res, 200, null, 'Заявка на проведение работ успешно создана!');
}

const roadworksHandler = async (req, res) => {
    try {

        switch(req.method) {
            case 'PUT': {
                return await createRoadworks(req, res);
            }
            default:
                res.setHeader('Allow', ['PUT'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default roadworksHandler