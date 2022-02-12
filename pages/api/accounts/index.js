import { getSession } from 'next-auth/react'

import UserModel from '../../../models/User'
import RoleModel from '../../../models/Role'

import { isAcceptByRole, sendJson, notSuccess200Json, generateApiError, catchApiError } from '../../../lib/functions'

const accountsHandler = async (req, res) => {
    try {
        let filterQuery = {};

        if (!isAcceptByRole(await getSession({ req }))) 
            throw generateApiError('Доступ запрещен', 403);

        if (req.query.role) {
            role = await RoleModel.findOne({ id: parseInt(role) });
            if (!role) return notSuccess200Json(res, 'Тип компании задан неверно');
            filterQuery['role.id'] = role.id;
            console.log(filterQuery);
        }

        let accounts = (await UserModel.find(filterQuery)).map((acc) => {
            return {
                id: acc._id,
                name: `${acc.surname} ${acc.name} ${acc.patronymic}`,
                company: acc.company,
                role: acc.role.name,
            }
        })

        return sendJson(res, 200, accounts)
        
    } catch(err) {
        return catchApiError(err, res)
    }
}

export default accountsHandler
