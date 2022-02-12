import { getSession } from 'next-auth/react'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

import { isAcceptByRole, sendJson, generateApiError, catchApiError } from '../../../lib/functions'

const accountsHandler = async (req, res) => {
    try {

        await dbConnect()

        if (!isAcceptByRole(await getSession({ req }))) 
            throw generateApiError('Доступ запрещен', 403);

        await dbConnect()
        let accounts = (await UserModel.find({})).map((acc) => {
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
