import { getSession } from 'next-auth/react'

import ObjectId from '../../../../lib/objectId'

import RequestModel from '../../../../models/Request'
import UserModel from '../../../../models/User'

import { REQUEST_STATUS_ENUM } from '../../../../lib/constants'

import { 
    isSession,
    isAcceptByRole, 
    isOwnerDataSession, 
    sendJson, 
    notSuccess200Json, 
    generateApiError, 
    catchApiError, 
    trimBody,
    dateFormatFromISO } from '../../../../lib/functions'

const toggleRejectDocument = async (req, res) => {
    try {
        if (req.method != 'POST') {
            res.setHeader('Allow', ['POST'])
            return sendJson(res, 405, null, `Метод ${req.method} не разрешен`)
        }

        const { id } = req.query
        let { fileId, checked } = req.body

        await RequestModel.updateOne({
            'files._id': ObjectId(fileId)
        }, {
            '$set': {
                'files.$.isRejected': checked
            }
        })

        sendJson(res, 200)
    } catch(err) {
        return catchApiError(err, res)
    }
}

export default toggleRejectDocument