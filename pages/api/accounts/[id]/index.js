import * as emailValidator from 'email-validator'
import * as bcrypt from 'bcrypt'

import dbConnect from '../../../../lib/mongoose'
import UserModel from '../../../../models/User'
import RoleModel from '../../../../models/Role'

import { 
    isAdminSession, 
    isOwnerDataSession, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    trimBody } from '../../../../lib/functions'

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

const editAccount = async (req, res) => {
    if (!(await isAdminSession(req)) 
    && !(await isOwnerDataSession(req))) throw generateApiError('Доступ запрещен', 403);

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