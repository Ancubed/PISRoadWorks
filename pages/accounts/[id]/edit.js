import { useSession, getSession } from 'next-auth/react'
import Error from '../../../components/error'
import CustomForm from '../../../components/customForm.tsx'

// import dbConnect from '../../lib/mongoose'
// import UserModel from '../../models/User'

const EditAccount = (props) => {
    const { data: session } = useSession()

    if (!session || !session.user)
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    const fields = [
        {
            type: 'select',
            id: 'role',
            labelText: 'Тип компании',
            required: true,
            options: [
                {
                    value: '0',
                    text: 'Администратор',
                },
                {
                    value: '1',
                    text: 'Заказчик',
                },
                {
                    value: '2',
                    text: 'Исполнитель',
                },
            ],
        },
        {
            type: 'text',
            id: 'company',
            labelText: 'Название компании',
            required: true,
        },
        {
            type: 'text',
            id: 'surname',
            labelText: 'Фамилия',
            required: true,
            value: '',
        },
        {
            type: 'text',
            id: 'name',
            labelText: 'Имя',
            required: true,
            value: '',
        },
        {
            type: 'text',
            id: 'patronymic',
            labelText: 'Отчество',
            required: true,
            value: '',
        },
        {
            type: 'email',
            id: 'email',
            labelText: 'Email',
            required: true,
            value: '',
        },
        {
            type: 'password',
            id: 'password',
            labelText: 'Пароль',
            required: true,
            value: '',
        },
        {
            type: 'password',
            id: 'repeatPassword',
            labelText: 'Повторите пароль',
            required: true,
            value: '',
        },
    ]

    return (
        <main>
            <h1 className="text-2xl mb-4">Создать аккаунт</h1>
            <CustomForm
                fields={fields}
                buttonText="Добавить"
                method="put"
                url="/api/accounts/create"
            />
        </main>
    )
}

export async function getServerSideProps(context) {
    // const { id } = context.query;
    // let acc, data = null;
    // if (id != 'create') {
    //     await dbConnect();
    //     try {
    //         acc = await UserModel.findOne({ _id: id });
    //     } catch (err) {
    //         console.log('Неверный id');
    //     }
    //     let name = acc.name.split(' ');
    //     if (acc) data = {
    //         id: acc._id.toString(),
    //         company: acc.company,
    //         surname: name[0],
    //         name: name[1],
    //         patronymic: name[2] || '',
    //         email: acc.company,
    //         roleName: acc.role.name,
    //         roleId: acc.role.id
    //     }s
    // }

    return {
        props: {
            session: await getSession(context),
        },
    }
}

export default EditAccount
