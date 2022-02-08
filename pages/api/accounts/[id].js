import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

import { sendJson } from '../../../lib/functions'

const createAccount = (req, res) => {

    console.log(req.body);
    if (req.body.password !== req.body.repeatPassword) {
        return sendJson(res, 200, null, 'Пароли не совпадают', false);
    }
    return sendJson(res, 200, null, 'Аккаунт успешно создан!');
}

const editAccount = () => {

}

const createAccountHandler = async (req, res) => {
    const session = await getSession({ req })

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
}

export default createAccountHandler