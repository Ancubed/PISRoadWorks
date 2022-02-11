import { useSession, getSession } from 'next-auth/react'
import Error from '../../../components/error'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

function Account(props) {
    const { data: session } = useSession()

    if (!props.account)
        return <Error errStatusCode={404} errMessage="Аккаунт не существует"/>

    //if (!session || !session.user)
    //    return <Error errStatusCode={403} errMessage="Нет доступа" />

    return (
        <main>
            <h1 className="text-2xl mb-4">{props.account.company}</h1>
            <div className="">
                <div className="my-2">
                    <h2 className="text-xl">Тип аккаунта</h2>
                    <span>{props.account.roleName}</span>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Руководитель</h2>
                    <span>{`${props.account.surname} ${props.account.name} ${props.account.patronymic}`}</span>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Email</h2>
                    <span>{props.account.email}</span>
                </div>
            </div>
        </main>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    let acc, data = null;
    await dbConnect();
    try {
        acc = await UserModel.findOne({ _id: id });
    } catch (err) {
        console.log('Неверный id');
    }
    if (acc) data = {
        id: acc._id.toString(),
        company: acc.company,
        surname: acc.surname,
        name: acc.name,
        patronymic: acc.patronymic || '',
        email: acc.email,
        roleName: acc.role.name,
        roleId: acc.role.id.toString()
    }

    return {
        props: {
            session: await getSession(context),
            account: data
        },
    }
}

export default Account