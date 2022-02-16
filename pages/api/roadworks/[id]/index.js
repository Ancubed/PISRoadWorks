import { getSession } from 'next-auth/react'

import RequestModel from '../../../../models/Request'

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
    if (!isAcceptByRole(await getSession({ req })) 
    && !isOwnerDataSession(
        await getSession({ req }),
        req.query.id)) 
            throw generateApiError('Доступ запрещен', 403);

    if (!req.body) throw generateApiError('Запрос с пустым body', 400);

    trimBody(req);

    const { id } = req.query;
    if (!id) generateApiError('Не указан id', 400);

    let { role, company, surname, name, patronymic, email, password, repeatPassword } = req.body;

    if (!role 
        || !company 
        || !surname 
        || !name 
        || !patronymic 
        || !email) return notSuccess200Json(res, 'Пожалуйста, заполните все поля');

    const updatingObject = {
        name: name,
        surname: surname,
        patronymic: patronymic,
        company: company
    }
    
    if (password) {
        if (password !== repeatPassword)
            return notSuccess200Json(res, 'Пароли не совпадают');

        updatingObject.password = await bcrypt.hash(password, 10);
    }

    await UserModel.findByIdAndUpdate(id, updatingObject);

    return sendJson(res, 200, null, 'Аккаунт успешно изменен!');
}

const deleteRoadwork = async (req, res) => {
    
    if (!isAcceptByRole(await getSession({ req })))
        throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;
    if (!id) generateApiError('Не указан id', 400);

    await UserModel.findByIdAndRemove(id)

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