import { useSession, getSession } from 'next-auth/react'
import Error from '../../components/common/error'
import CustomForm from '../../components/common/customForm.tsx'

import UserModel from '../../models/User'

import { isAcceptByRole } from '../../lib/functions'

const CreateRoadworks = (props) => {
    const { data: session } = useSession()

    if (!isAcceptByRole(session, [0, 1]))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    const fields = [
        {
            type: 'select',
            id: 'role',
            labelText: 'Исполнитель',
            required: true,
            options: props.options
        },
        {
            type: 'text',
            id: 'adress',
            labelText: 'Адрес',
            required: true,
        },
        {
            type: 'textarea',
            id: 'comment',
            labelText: 'Комментарий',
            required: false,
            value: '',
        },
        {
            type: 'date',
            id: 'dateStart',
            labelText: 'Дата начала работ',
            required: true,
            value: '',
        },
        {
            type: 'date',
            id: 'dateEnd',
            labelText: 'Дата окончания работ',
            required: true,
            value: '',
        }
    ];

    return (
        <main>
            <h1 className="text-2xl mb-4">Создать дорожную работу</h1>
            <CustomForm
                fields={fields}
                buttonText="Создать"
                method="put"
                url="/api/roadworks/create"
            />
        </main>
    )
}

export async function getServerSideProps(context) {
    let options = (await UserModel.find({ "role.id": 2 })).map((acc) => {
        return {
            value: acc._id.toString(),
            text: `${acc.company} - ${acc.surname} ${acc.name} ${acc.patronymic}`
        }
    });

    return {
        props: {
            session: await getSession(context),
            options: options
        },
    }
}

export default CreateRoadworks