import Link from 'next/link';
import Row from '../components/row';
//import dbConnect from '../lib/mongoose';
// import UserModel from '../models/User';
//import RequestModel from '../models/Request';

const matrixWeight = {
    done: 3,
    inProgress: 1.2,
    expired: -1.5,
};

export default function Indicators({ executors }) {
    return (
        <main>
            <h1 className='text-2xl mb-4'>Показатели выполнения работ</h1>
            <table className='w-full'>
                <tbody>
                    <Row companyName='Название' total='Всего' done='Выполнено' inProgress='Выполняется' expired='Просрочено' grade='Оценка' isHeader={true}></Row>
                    {executors.map((executor, key) => 
                        <Row companyName={executor.companyName || 'Скрытая компания'}
                        total={(executor.done + executor.inProgress + executor.expired) || 0}
                        done={executor.done || 0}
                        inProgress={executor.inProgress || 0} 
                        expired={executor.expired || 0}
                        grade={executor.grade || 0}

                        key={key}>
                        </Row>
                    )}
                </tbody>
            </table>
        </main>
    )
}

const result = [
    {
      id: '61c17e2a842819c5a3c627fb',
      companyName: 'Дорстрой',
      inProgress: 2,
      expired: 1,
      done: 2
    },
    {
      id: '61c17e2a842819c5a3c627fb',
      companyName: 'Уфа-строй',
      inProgress: 1
    },
    {
      id: '61c17e76842819c5a3c62804',
      companyName: 'Асфальт-строй',
      expired: 0,
      done: 5,
      inProgress: 2
    },
    {
      id: '61c17e76842819c5a3c62804',
      companyName: 'Санч-автодор',
      expired: 4,
      done: 1,
      inProgress: 2
    },
    {
      id: '61c17e76842819c5a3c62804',
      companyName: 'Дорога домой',
      expired: 2,
      done: 3,
      inProgress: 4
    },
    {
      id: '61c17e76842819c5a3c62804',
      companyName: 'Иванчай',
      expired: 1,
      done: 3,
      inProgress: 1
    }
];

function checkStatusCount(executor) {
    executor.done = executor.done || 0;
    executor.inProgress = executor.inProgress || 0; 
    executor.expired = executor.expired || 0;
    return executor;
}

async function aggregateExecutors() {
    await dbConnect();
    const result = await RequestModel.aggregate([
        {
            $match: {
                "status": { $nin: ["new"]}
            }
        },
        {
            $group: {
                _id: {
                    "status": "$status",
                    "companyId": "$companyId",
                    "companyName": "$companyName"
                },
                "count": { "$sum": 1 }
            }
        },
        { 
            $group: {
            _id: {
                "companyId": "$_id.companyId",
                "companyName": "$_id.companyName"
            },
            "requests": {
                "$push": {
                    "status": "$_id.status",
                    "count": "$count"
                }
            }
        }
    }]);
    return result.map((executor) => {
        executor.id = executor._id.companyId.toString();
        executor.companyName = executor._id.companyName;
        for (let i = 0; i < executor.requests.length; i++) {
            const status = executor.requests[i].status;
            const count = executor.requests[i].count;
            executor[status] = count;
        }
        delete executor._id;
        delete executor.requests;
        return checkStatusCount(executor);
    });
}

async function decisionMatrix(executors) {
    for (let i = 0; i < executors.length; i++) {
        const done = executors[i].done || 0, 
        inProgress = executors[i].inProgress || 0,
        expired = executors[i].expired || 0;
        executors[i].grade = done * matrixWeight.done 
        + inProgress * matrixWeight.inProgress
        + expired * matrixWeight.expired;
    }
    return executors;
}

async function gradeNormalize(executors) {
    let maxGrade = Math.max(...executors.map(exec => exec.grade));
    for (let i = 0; i < executors.length; i++) {
        let grade = Math.ceil(executors[i].grade / maxGrade * 100);
        executors[i].grade = grade > 0 ? grade : 0;
    }
    return executors;
}

async function sortByGrade(executors) {
    if (executors && executors.length != 0) {
        return executors.sort((prev, next) => {
            return next.grade - prev.grade;
        });
    }
}

export async function getServerSideProps() {
    //let result = await aggregateExecutors(); // Результат аггрегации
    result.forEach(exec => { // Код провеки статусов при отсутствии подключния к mongo atlas
        checkStatusCount(exec);
    });

    const gradedExecutors = await decisionMatrix(result); // Подсчет решения
    const executors = await gradeNormalize(gradedExecutors); // Нормализация значений (от 0 до 100)
    const sortedExecutors = await sortByGrade(executors); // Сортировка по оценке
    return { props: { executors: sortedExecutors } };
  }