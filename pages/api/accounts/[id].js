import * as emailValidator from 'email-validator'
import * as bcrypt from 'bcrypt'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'
import RoleModel from '../../../models/Role'

import { isAdminSession, sendJson, generateApiError, catchApiError } from '../../../lib/functions'

const notSuccess200Json = (res, message) => {
    return sendJson(res, 200, null, message, false);
}

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

const createAccount = async (req, res) => {

    if (!(await isAdminSession(req))) throw generateApiError('Доступ запрещен', 403);

    if (!req.body) throw generateApiError('Запрос с пустым body', 400);

    let { role, company, surname, name, patronymic, email, password, repeatPassword } = req.body;

    if (!role 
        || !company 
        || !surname 
        || !name 
        || !patronymic 
        || !email 
        || !password 
        || !repeatPassword) return notSuccess200Json(res, 'Пожалуйста, заполните все поля');

    role = await RoleModel.findOne({ id: parseInt(role) });
    if (!role) return notSuccess200Json(res, 'Тип компании задан неверно');

    if (!emailValidator.validate(email))
        return notSuccess200Json(res, 'Неверный формат Email');

    if (await UserModel.findOne({ email })) 
        return notSuccess200Json(res, 'Аккаунт с таким email уже существует');

    if (await UserModel.findOne({ company })) 
        return notSuccess200Json(res, 'Аккаунт с таким названием компании уже существует');

    if (password !== repeatPassword)
        return notSuccess200Json(res, 'Пароли не совпадают');

    const passwordHash = await bcrypt.hash(password, 10);

    await (new UserModel({
        email: email,
        name: `${surname} ${name} ${patronymic}`,
        company: company,
        role: {
            id: role.id,
            name: role.name
        },
        password: passwordHash
    })).save();

    return sendJson(res, 200, null, 'Аккаунт успешно создан!');
}

const editAccount = () => {

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
            case 'PUT': {
                if (req.query.id != 'create') {
                    res.setHeader('Allow', ['GET', 'PUT', 'POST'])
                    return sendJson(res, 405, null, `Метод ${req.method} разрешен только для create`)
                }
                return await createAccount(req, res);
            }
            case 'POST': {
                return editAccount();
            }
            case 'DELETE': {
                return await deleteAccount(req, res);
            }
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'POST'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default accountHandler