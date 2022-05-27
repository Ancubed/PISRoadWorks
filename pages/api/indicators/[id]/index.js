import { getSession } from 'next-auth/react'

import aggregateExecutors from '../../../../lib/aggregation'

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


const getIndicators = async (req, res) => {

    // if (!isAcceptByRole(await getSession({ req }))) 
    //     throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;

    if (!id) generateApiError('Не указан id', 400);

    let result = null;

    try {
        result = (await aggregateExecutors()).find(executor => executor.id == id);
    } catch (err) {
        throw generateApiError('Ошибка при выполнении аггрегации', 400);
    }

    if (!result) throw new Error('Данные не найдены');

    return sendJson(res, 200, result);
}

const indicatorsHandler = async (req, res) => {
    try {

        switch(req.method) {
            case 'GET': {
                return await getIndicators(req, res);
            }
            default:
                res.setHeader('Allow', ['GET'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default indicatorsHandler