import { useSession, getSession } from 'next-auth/react'
import Error from '../../../components/common/error'
import CustomForm from '../../../components/common/customForm'

import RequestModel from '../../../models/Request'
import UserModel from '../../../models/User'

import { isAcceptByRole, isOwnerDataSession } from '../../../lib/functions'

function EditRoadwork(props) {
    const { data: session } = useSession()

    if (!props.roadwork)
        return <Error errStatusCode={404} errMessage="Заявки не существует" />

    if (!isAcceptByRole(session) && !isOwnerDataSession(session, props.roadwork.customerId))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    const fields = [
        {
            type: 'coordinates',
            id: 'coordinates',
            labelText: 'Карта',
            required: false,
            coords: props.roadwork.coordinates,
            disabled: props.roadwork.status === 'accepted'
        },
        {
            type: 'select',
            id: 'executorId',
            labelText: 'Исполнитель',
            required: true,
            options: props.options,
            value: props.roadwork.executorId,
            disabled: props.roadwork.status === 'accepted'
        },
        {
            type: 'text',
            id: 'adress',
            labelText: 'Адрес',
            required: true,
            value: props.roadwork.adress,
            disabled: props.roadwork.status === 'accepted'
        },
        {
            type: 'date',
            id: 'dateStart',
            labelText: 'Дата начала работ',
            required: true,
            value: props.roadwork.dateStart,
            min: new Date().toISOString().split("T")[0],
            disabled: props.roadwork.status === 'accepted'
        },
        {
            type: 'date',
            id: 'dateEnd',
            labelText: 'Дата окончания работ',
            required: true,
            value: props.roadwork.dateEnd,
            min: new Date().toISOString().split("T")[0],
            disabled: props.roadwork.status === 'accepted'
        },
        {
            type: 'textarea',
            id: 'comment',
            labelText: 'Комментарий',
            required: false,
            value: props.roadwork.comment,
            disabled: props.roadwork.status == 'accepted'
        }
    ];

    return (
        <main>
            <h1 className="text-2xl mb-4">Редактировать заявку</h1>
            <CustomForm
                fields={fields}
                buttonText="Изменить"
                method="post"
                url={`/api/roadworks/${props.roadwork.id}`} />
        </main>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query;
    let work, data = null;
    try {
        work = await RequestModel.findOne({ _id: id });
    } catch (err) {
        console.log('Неверный id');
    }
    if (work) data = {
        id: work._id.toString(),
        customerId: work.customerId.toString(),
        executorId: work.executorId.toString(),
        executorName: work.executorName,
        coordinates: work.coordinates,
        status: work.status,
        adress: work.adress,
        dateStart: work.dateOfStart?.toISOString().split('T')[0],
        dateEnd: work.dateOfEnd?.toISOString().split('T')[0],
        comment: work.comment
    }
    let options = (await UserModel.find({ "role.id": 2 })).map((acc) => {
        return {
            value: acc._id.toString(),
            text: `${acc.company} - ${acc.surname} ${acc.name} ${acc.patronymic}`
        }
    });

    return {
        props: {
            session: await getSession(context),
            roadwork: data,
            options: options
        },
    }
}

export default EditRoadwork
