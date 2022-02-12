import { useSession, getSession } from 'next-auth/react'
import Error from '../../components/error'
import CustomForm from '../../components/customForm.tsx'

const CreateAccount = (props) => {
    const { data: session } = useSession()

    if (!session || !session.user || session.user.role.id != 0)
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
                buttonText="Создать"
                method="put"
                url="/api/accounts/create"
            />
        </main>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getSession(context),
        },
    }
}

export default CreateAccount
