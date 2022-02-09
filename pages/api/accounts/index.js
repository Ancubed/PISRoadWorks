import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

import { isAdminSession, sendJson, generateApiError, catchApiError } from '../../../lib/functions'

const accountsHandler = async (req, res) => {
    try {

        await dbConnect()

        if (!(await isAdminSession(req))) throw generateApiError('Доступ запрещен', 403);

        await dbConnect()
        let accounts = (await UserModel.find({})).map((acc) => {
            return {
                id: acc._id,
                name: acc.name,
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
