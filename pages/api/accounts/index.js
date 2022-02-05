import { getSession } from "next-auth/react"

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

import { sendJson } from "../../../lib/functions"

const accountsHandler = async (req, res) => {
    const session = await getSession({ req });
    
    if (!session || !session.user || session.user.role.id != 0) {
        sendJson(res, 403, null, 'У вас нет доступа к данным');
    }

    await dbConnect();
    let accounts = (await UserModel.find({})).map(acc => {
        return {
            id: acc._id,
            name: acc.name,
            company: acc.company,
            role: acc.role.name
        }
    });

    sendJson(res, 200, accounts);
}

export default accountsHandler