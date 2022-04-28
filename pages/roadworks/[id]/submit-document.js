import { useSession, getSession } from 'next-auth/react'
import Error from '../../../components/common/error'
import CustomFiles from '../../../components/common/customFiles'

import { YMaps, Map, Polyline } from 'react-yandex-maps';

import RequestModel from '../../../models/Request'
import RoadworkInfo from '../../../components/roadworks/roadworkInfo';

import { dateFormatFromISO } from '../../../lib/functions'

import { isAcceptByRole, isOwnerDataSession } from '../../../lib/functions'

function SubmitDocuments(props) {
    const { data: session } = useSession()

    if (!props.roadwork)
        return <Error errStatusCode={404} errMessage="Дорожная работа не существует"/>

    if (!isAcceptByRole(session) && !isOwnerDataSession(session, props.roadwork.executorId))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    // Проверять статус заявки - нельзя изменять документы, когда работа одобрена+

    return (
        <main>
            <h1 className="text-2xl mb-4">{`Работа №${props.roadwork.id}`}</h1>
            <div className="-m-2 flex flex-row flex-wrap lg:flex-nowrap">
                <YMaps>
                    <Map
                        defaultState={{
                            center: props.roadwork.coordinates[0] || [51.786, 55.104],
                            zoom: 15,
                            autoFitToViewport: 'always'
                        }}
                        className='m-2 flex basis-3/4 grow lg:grow-0 h-96'
                    >
                        <Polyline
                            geometry={props.roadwork.coordinates}
                            options={{
                                balloonCloseButton: true,
                                strokeColor: '#000',
                                strokeWidth: 4,
                                strokeOpacity: 0.5
                            }}
                        />
                    </Map>
                </YMaps>
                <RoadworkInfo className='m-2 flex basis-1/4 grow lg:grow-0' roadwork={props.roadwork}/>
            </div>
            <div className=''>
                <h1 className="text-2xl my-4">Документы</h1>
                <CustomFiles />
            </div>
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
        executorId: work.executorId.toString(),
        executorName: work.executorName,
        coordinates: work.coordinates,
        status: work.status,
        adress: work.adress,
        dateStart: dateFormatFromISO(work.dateOfStart?.toISOString()),
        dateEnd: dateFormatFromISO(work.dateOfEnd?.toISOString()),
        comment: work.comment
    }

    return {
        props: {
            session: await getSession(context),
            roadwork: data
        }
    }
}

export default SubmitDocuments