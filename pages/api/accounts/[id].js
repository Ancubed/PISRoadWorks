import * as emailValidator from 'email-validator'
import * as bcrypt from 'bcrypt'

import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'
import RoleModel from '../../../models/Role'

import { sendJson, generateApiError, catchApiError } from '../../../lib/functions'

const notSuccess200Json = (res, message) => {
    return sendJson(res, 200, null, message, false);
}

const createAccount = async (req, res) => {
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

const createAccountHandler = async (req, res) => {
    try {
        const session = await getSession({ req });

        if (!session || !session.user || session.user.role.id != 0) {
            return sendJson(res, 403, null, 'У вас нет доступа к данным');
        }

        switch(req.method) {
            case 'PUT': {
                if (req.query.id != 'create') {
                    res.setHeader('Allow', ['PUT', 'POST'])
                    return sendJson(res, 405, null, `Метод ${req.method} разрешен только для create`)
                }
                return createAccount(req, res);
            }
            case 'POST': {
                return editAccount();
            }
            default:
                res.setHeader('Allow', ['PUT', 'POST'])
                return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }    
    } catch(err) {
       catchApiError(err, res)
    }
}

export default createAccountHandler