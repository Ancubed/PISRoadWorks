import RequestModel from '../models/Request'

function checkStatusCount(executor) {
    executor.done = executor.done || 0
    executor.inProgress = executor.inProgress || 0
    executor.expired = executor.expired || 0
    return executor
}

export default async function aggregateExecutors() {
    let result = await RequestModel.aggregate([
        {
            $match: {
                status: { $nin: ['new'] },
            },
        },
        {
            $group: {
                _id: {
                    status: '$status',
                    executorId: '$executorId',
                    executorName: '$executorName',
                },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: {
                    executorId: '$_id.executorId',
                    executorName: '$_id.executorName',
                },
                requests: {
                    $push: {
                        status: '$_id.status',
                        count: '$count',
                    },
                },
            },
        },
    ])
    return result.map((executor) => {
        executor.id = executor._id.executorId.toString()
        executor.companyName = executor._id.executorName
        for (let i = 0; i < executor.requests.length; i++) {
            const status = executor.requests[i].status
            const count = executor.requests[i].count
            executor[status] = count
        }
        delete executor._id
        delete executor.requests
        return checkStatusCount(executor)
    });
}