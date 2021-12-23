import Link from 'next/link';
import Row from '../components/row';
import dbConnect from '../lib/mongoose';
// import UserModel from '../models/User';
import RequestModel from '../models/Request';

export default function Indicators({ executors }) {
    return (
        <main>
            <h1 className='text-2xl mb-4'>Показатели выполнения работ</h1>
            <table className='w-full'>
                <tbody>
                    <Row companyName='Название' total='Всего' done='Выполнено' inProgress='Выполняется' expired='Просрочено' grade='Оценка' isHeader={true}></Row>
                    {executors.map((executor, key) => 
                        <Row companyName={executor.companyName}
                        total={executor.total}
                        done={executor.done}
                        inProgress={executor.inProgress} 
                        expired={executor.expired}
                        grade={executor.grade}

                        key={key}>
                        </Row>
                    )}
                </tbody>
            </table>
        </main>
    )
}

const Users = [
    {
      _id: '61c17dd4842819c5a3c627f5',
      email: 'destro@gmail.com',
      name: 'Андрей Антонов',
      company: 'ОГУ',
      role: 'executor',
      password: 'hex',
      __v: 0
    },
    {
      _id: '61c17e2a842819c5a3c627fb',
      email: 'destro@gmail.com',
      name: 'Максим Кириллов',
      company: 'Дорстрой',
      role: 'executor',
      password: 'hex',
      __v: 0
    },
    {
      _id: '61c17e43842819c5a3c627fe',
      email: 'destro@gmail.com',
      name: 'Кирилл Максимов',
      company: 'Уфа-строй',
      role: 'executor',
      password: 'hex',
      __v: 0
    },
    {
      _id: '61c17e63842819c5a3c62801',
      email: 'destro@gmail.com',
      name: 'Кирилл Рычагов',
      company: 'Орен-строй',
      role: 'executor',
      password: 'hex',
      __v: 0
    },
    {
      _id: '61c17e76842819c5a3c62804',
      email: 'destro@gmail.com',
      name: 'Санчиз Спирин',
      company: 'Асфальт-строй',
      role: 'executor',
      password: 'hex',
      __v: 0
    }
]

const executors = [
    {
        _id: '61c17e76842819c5a3c62804',
        companyName: 'Асфальт-строй',
        companyId: '61c17e76842819c5a3c62804',
        total: 14,
        done: 11,
        expired: 2,
        inProgress: 1,
        grade: 97
    },
    {
        _id: '61c17e76842819c5a3c62804',
        companyName: 'Орен-строй',
        companyId: '61c17e76842819c5a3c62804',
        total: 15,
        done: 12,
        expired: 2,
        inProgress: 1,
        grade: 96
    },
    {
        _id: '61c17e76842819c5a3c62804',
        companyName: 'Уфа-строй',
        companyId: '61c17e76842819c5a3c62804',
        total: 21,
        done: 20,
        expired: 0,
        inProgress: 1,
        grade: 100
    },
    {
        _id: '61c17e76842819c5a3c62804',
        companyName: 'Карамба',
        companyId: '61c17e76842819c5a3c62804',
        total: 20,
        done: 18,
        expired: 2,
        inProgress: 0,
        grade: 99
    },
    {
        _id: '61c17e76842819c5a3c62804',
        companyName: 'Санчиз чисто',
        companyId: '61c17e76842819c5a3c62804',
        total: 1,
        done: 0,
        expired: 1,
        inProgress: 0,
        grade: 2
    },
]

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
        executor.name = executor._id.companyName;
        for (let i=0; i < executor.requests.length; i++) {
            let status = executor.requests[i].status;
            executor[status] = executor.requests[i].count;
        }
        delete executor._id;
        delete executor.requests;
        return executor;
    });
}

function filterRequests(requests) {
    let total = 0, done = 0, inProgress = 0, expired = 0;
    if (requests && requests.length != 0) {
        total = requests.length;
        done = requests.filter(req => req.status == 'done').length;
        inProgress = requests.filter(req => req.status == 'inProgress').length;
        expired = requests.filter(req => req.status == 'expired').length;
    }
    return { total, done, inProgress, expired };
}

async function sortByGrade(executors) {
    if (executors && executors.length != 0) {
        return executors.sort((prev, next) => {
            return next.grade - prev.grade;
        });
    }
}

export async function getServerSideProps() {
    let executors = await aggregateExecutors();
    // executors.forEach(executor => {
    //     let { total, done, inProgress, expired } = filterRequests(executor.requests);
    //     executor.total = total;
    //     executor.done = done;
    //     executor.inProgress = inProgress;
    //     executor.expired = expired;
    //     delete executor.requests;
    // });
    console.log(executors);
    return { props: { executors: await sortByGrade(executors) } };
  }