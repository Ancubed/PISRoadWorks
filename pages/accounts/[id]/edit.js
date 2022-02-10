import { useSession, getSession } from 'next-auth/react'
import Error from '../../../components/error'
import CustomForm from '../../../components/customForm'

import dbConnect from '../../../lib/mongoose'
import UserModel from '../../../models/User'

function EditAccount(props) {
    const { data: session } = useSession()

    if (!session || !session.user || session.user.role.id != 0 && session.user.id != props.account.id)
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    if (!props.account)
        return <Error errStatusCode={404} errMessage="Аккаунт не существует" />

    const fields = [
        {
            type: 'select',
            id: 'role',
            labelText: 'Тип компании',
            required: true,
            options: [
                {
                    value: '0',
                    text: 'Администратор'
                },
                {
                    value: '1',
                    text: 'Заказчик'
                },
                {
                    value: '2',
                    text: 'Исполнитель'
                },
            ],
            value: props.account.roleId,
            disabled: true
        },
        {
            type: 'text',
            id: 'company',
            labelText: 'Название компании',
            required: true,
            value: props.account.company
        },
        {
            type: 'text',
            id: 'surname',
            labelText: 'Фамилия',
            required: true,
            value: props.account.surname
        },
        {
            type: 'text',
            id: 'name',
            labelText: 'Имя',
            required: true,
            value: props.account.name
        },
        {
            type: 'text',
            id: 'patronymic',
            labelText: 'Отчество',
            required: true,
            value: props.account.patronymic
        },
        {
            type: 'email',
            id: 'email',
            labelText: 'Email',
            required: true,
            value: props.account.email
        },
        {
            type: 'password',
            id: 'password',
            labelText: 'Пароль',
            value: '',
        },
        {
            type: 'password',
            id: 'repeatPassword',
            labelText: 'Повторите пароль',
            value: '',
        },
    ]

    console

    return (
        <main>
            <h1 className="text-2xl mb-4">Редактировать аккаунт</h1>
            <CustomForm
                fields={fields}
                buttonText="Изменить"
                method="post"
                url={`/api/accounts/${props.account.id}`} />
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
    let name = acc.name.split(' ');
    if (acc) data = {
        id: acc._id.toString(),
        company: acc.company,
        surname: name[0],
        name: name[1],
        patronymic: name[2] || '',
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

export default EditAccount
