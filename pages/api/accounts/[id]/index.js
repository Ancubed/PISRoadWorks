import dbConnect from '../../../../lib/mongoose'
import UserModel from '../../../../models/User'

import { isAdminSession, sendJson, generateApiError, catchApiError } from '../../../../lib/functions'

const getAccount = async (req, res) => {

    if (!(await isAdminSession(req))) throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;

    if (!id) generateApiError('Не указан id', 400);

    let acc, data = null;

    try {
        acc = await UserModel.findOne({ _id: id });
    } catch (err) {
        throw generateApiError('Неверно указан id', 400);
    }

    if (acc) data = {
        id: acc._id,
        name: acc.name,
        company: acc.company,
        role: acc.role.name,
    }

    return sendJson(res, 200, data);
}

const editAccount = (req, res) => {
    console.log(req.body, req.query.id);
    return sendJson(res, 400)
}

const deleteAccount = async (req, res) => {
    
    if (!(await isAdminSession(req))) throw generateApiError('Доступ запрещен', 403);

    const { id } = req.query;

    if (!id) generateApiError('Не указан id', 400);

    await UserModel.findByIdAndRemove(id)

    return sendJson(res, 200);
}

const accountHandler = async (req, res) => {
    try {

        await dbConnect()

        switch(req.method) {
            case 'GET': {
                return await getAccount(req, res);
            }
            case 'POST': {
                return editAccount(req, res);
            }
            case 'DELETE': {
                return await deleteAccount(req, res);
            }
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default accountHandler