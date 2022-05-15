// import UserModel from '../models/User';
import RequestModel from '../../models/Request'

import Row from '../../components/common/row'

const matrixWeight = {
    done: 3,
    inProgress: 1.2,
    expired: -1.5,
}

const Indicators = ({ executors }) => {
    return (
        <main>
            <h1 className="text-2xl mb-4">Показатели выполнения работ</h1>
            {(!executors || executors.length == 0) 
            && 
            <span>
                Нет данных
            </span>}
            {executors && executors.length > 0
            && 
            <table className="w-full">
                <tbody>
                    <Row
                        companyName="Название"
                        total="Всего"
                        done="Выполнено"
                        inProgress="Выполняется"
                        expired="Просрочено"
                        grade="Оценка"
                        isHeader={true}
                    ></Row>
                    {executors.map((executor, key) => (
                        <Row
                            companyName={executor.companyName}
                            companyId={executor.id}
                            total={
                                executor.done +
                                    executor.inProgress +
                                    executor.expired
                            }
                            done={executor.done}
                            inProgress={executor.inProgress}
                            expired={executor.expired}
                            grade={executor.grade}
                            key={key}
                        ></Row>
                    ))}
                </tbody>
            </table>}
        </main>
    )
}

let result = [
    // Данные при отсутствии подключения к mongo atlas
    {
        id: '61c17e2a842819c5a3c627fb',
        companyName: 'Дорстрой',
        inProgress: 2,
        expired: 1,
        done: 2,
    },
    {
        id: '61c17e2a842819c5a3c627fb',
        companyName: 'Уфа-строй',
        done: 0,
        inProgress: 1,
        expired: 0,
    },
    {
        id: '61c17e76842819c5a3c62804',
        companyName: 'Асфальт-строй',
        expired: 0,
        done: 5,
        inProgress: 2,
    },
    {
        id: '61c17e76842819c5a3c62804',
        companyName: 'Санч-автодор',
        expired: 4,
        done: 1,
        inProgress: 2,
    },
    {
        id: '61c17e76842819c5a3c62804',
        companyName: 'Дорога домой',
        expired: 2,
        done: 3,
        inProgress: 4,
    },
    {
        id: '61c17e76842819c5a3c62804',
        companyName: 'Иванчай',
        expired: 1,
        done: 3,
        inProgress: 1,
    },
]

function checkStatusCount(executor) {
    executor.done = executor.done || 0
    executor.inProgress = executor.inProgress || 0
    executor.expired = executor.expired || 0
    return executor
}

async function aggregateExecutors() {
    try {
        result = await RequestModel.aggregate([
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
    } catch (err) {
        console.log('Ошибка подключения к atlas: ' + err)
    }
    return result
}

async function decisionMatrix(executors) {
    for (let i = 0; i < executors.length; i++) {
        const done = executors[i].done,
            inProgress = executors[i].inProgress,
            expired = executors[i].expired
        executors[i].grade =
            done * matrixWeight.done +
            inProgress * matrixWeight.inProgress +
            expired * matrixWeight.expired
    }
    return executors
}

async function gradeNormalize(executors) {
    let maxGrade = Math.max(...executors.map((exec) => exec.grade))
    for (let i = 0; i < executors.length; i++) {
        let grade = Math.ceil((executors[i].grade / maxGrade) * 100)
        executors[i].grade = grade > 0 ? grade : 0
    }
    return executors
}

async function sortByGrade(executors) {
    if (executors && executors.length != 0) {
        return executors.sort((prev, next) => {
            return next.grade - prev.grade
        })
    }
}

export async function getServerSideProps() {
    //let result = await aggregateExecutors(); // Результат аггрегации
    let result = await aggregateExecutors()
    if (result && result.length > 0) {
        const gradedExecutors = await decisionMatrix(result) // Подсчет решения
        const executors = await gradeNormalize(gradedExecutors) // Нормализация значений (от 0 до 100)
        result = await sortByGrade(executors) // Сортировка по оценке
    }
    return { props: { executors: result } }
}

export default Indicators
