import { REQUEST_STATUS_ENUM } from '../../../lib/constants' 

import RequestModel from '../../../models/Request'

import { sendJson, notSuccess200Json, catchApiError, dateFormatFromISO } from '../../../lib/functions'

const roadworksHandler = async (req, res) => {
    try {
        let filterQuery = {};

        if (req.query.status) {
            let status = REQUEST_STATUS_ENUM.find(status => status === req.query.status);
            if (!status) return notSuccess200Json(res, 'Статус заявки указан неверно');
            filterQuery['status'] = status;
        }
        let roadworks = (await RequestModel.find(filterQuery).sort('-dateOfStart').exec()).map((work) => {
            return {
                id: work._id,
                executorId: work.executorId,
                executorName: work.executorName,
                status: work.status,
                adress: work.adress,
                dateStart: dateFormatFromISO(work.dateOfStart?.toISOString()),
                dateEnd: dateFormatFromISO(work.dateOfEnd?.toISOString())
            }
        })

        return sendJson(res, 200, roadworks)
        
    } catch(err) {
        return catchApiError(err, res)
    }
}

export default roadworksHandler
