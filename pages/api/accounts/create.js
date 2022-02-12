import * as emailValidator from 'email-validator'
import * as bcrypt from 'bcrypt'

import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'
import RoleModel from '../../../models/Role'

import { isAcceptByRole, sendJson, notSuccess200Json, generateApiError, catchApiError, trimBody } from '../../../lib/functions'

const createAccount = async (req, res) => {

    if (!isAcceptByRole(await getSession({ req }))) 
        throw generateApiError('Доступ запрещен', 403);

    if (!req.body) throw generateApiError('Запрос с пустым body', 400);

    trimBody(req);

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
        name: name,
        surname: surname,
        patronymic: patronymic,
        company: company,
        role: {
            id: role.id,
            name: role.name
        },
        password: passwordHash
    })).save();

    return sendJson(res, 200, null, 'Аккаунт успешно создан!');
}

const accountHandler = async (req, res) => {
    try {

        await dbConnect()

        switch(req.method) {
            case 'PUT': {
                return await createAccount(req, res);
            }
            default:
                res.setHeader('Allow', ['PUT'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    

    } catch(err) {
       return catchApiError(err, res)
    }
}

export default accountHandler