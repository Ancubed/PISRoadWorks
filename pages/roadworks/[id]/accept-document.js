import { useSession, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import Image from 'next/image'

import Error from '../../../components/common/error'
import FormButton from '../../../components/common/formButton'

import { YMaps, Map, Polyline } from 'react-yandex-maps';

import RequestModel from '../../../models/Request'
import RoadworkInfo from '../../../components/roadworks/roadworkInfo';

import { dateFormatFromISO } from '../../../lib/functions'

import { isAcceptByRole, isOwnerDataSession } from '../../../lib/functions'

function AcceptDocuments(props) {
    const { data: session } = useSession()
    const [rejected, setRejected] = useState(false)
    const [rejectTextareaValue, setRejectTextareaValue] = useState(props.roadwork.rejectComment || '')

    const onTextareaChange = (e) => {
        setRejectTextareaValue(e.target.value)
    }

    const toggleReject = () => {
        setRejected(!rejected)
    }

    const getResponse = async (status, comment = null) => {
        let body = { status: status }
        if (comment) body.comment = comment
        return await fetch(`/api/roadworks/${props.roadwork.id}/change-status`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        });
    }

    const onAccept = async (e) => {
        let response = await getResponse('inProgress')
        if (response.ok) {
            let json = await response.json()
            if (json.isSuccess) {
                Router.push('/profile')
            }
        } else {
            alert('Ошибка при смене статуса')
        }
    }

    const onReject = async (e) => {
        if (!rejectTextareaValue) return alert('Укажите причину отклонения')
        if (rejectTextareaValue.length < 5) return alert('Слишком короткая причина отклонения')

        let response = await getResponse('rejected', rejectTextareaValue)
        if (response.ok) {
            let json = await response.json()
            if (json.isSuccess) {
                Router.push('/profile')
            }
        }
    }

    if (!props.roadwork)
        return <Error errStatusCode={404} errMessage="Дорожная работа не существует"/>

    if (!isAcceptByRole(session) && !isOwnerDataSession(session, props.roadwork.customerId))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    // if (props.roadwork.status !== 'submitted')
    //     return <Error errStatusCode={403} errMessage="Нет доступа"/>

    return (
        <main>
            <h1 className="text-2xl mb-4">{`Работа №${props.roadwork.id}`}</h1>
            <div className="-m-2 flex flex-row flex-wrap xl:flex-nowrap">
                <YMaps>
                    <Map
                        defaultState={{
                            center: props.roadwork.coordinates[0] || [51.786, 55.104],
                            zoom: 15,
                            autoFitToViewport: 'always'
                        }}
                        className='m-2 flex basis-3/4 grow xl:grow-0 h-96'
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
                <div>
                    {props.roadwork.files && props.roadwork.files.length > 0 
                    ?
                        props.roadwork.files.map((file, idx) => 
                            <a href={`/api/files/${file._id}`} target="_blank" rel="noreferrer" key={idx} className='flex align-center hover:text-blue-600'>
                                {`${idx + 1}. ${file.filename}`} 
                                <Image src="/download.svg" alt="" width={16} height={16} />
                            </a>
                        )
                    :
                        <div>Нет прикрепленных документов</div>
                    }
                </div>
            </div>
            {props.roadwork.status != 'inProgress' && props.roadwork.status != 'expired' &&props.roadwork.status != 'done'
            && 
                <div className=''>
                    <h1 className="text-2xl my-4 flex justify-between">
                        Решение по работе
                        {rejected 
                        && 
                        <button className={`inline justify-center hover:text-blue-600`}
                            onClick={toggleReject}
                        >
                            <Image src="/reply.svg" alt="Назад" width={16} height={16} />
                        </button>
                        }
                    </h1>
                    {!rejected 
                    ?
                        <div className='flex'>
                            <FormButton 
                            type="button" 
                            text={<div className='flex justify-center'>
                                <Image src="/check.svg" alt="" width={16} height={16} />
                                <span className='ml-2'>Принять</span>
                            </div>} 
                            onClick={onAccept} 
                            className='my-2'/>
                            <FormButton 
                            type="button" 
                            text={<div className='flex justify-center'>
                                <Image src="/x.svg" alt="" width={16} height={16} />
                                <span className='ml-2'>Отклонить</span>
                            </div>} 
                            onClick={toggleReject} 
                            className='my-2'/>
                        </div>
                    :
                        <div>
                            <h2 className="text-xl">Укажите причину</h2>
                            <textarea onChange={onTextareaChange} value={rejectTextareaValue} className='w-full h-32 rounded border-2'></textarea>
                            <FormButton type="button" text='Отклонить' onClick={onReject} className='my-2'/>
                        </div>
                    }
                </div>
            }
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
        customerId: work.customerId.toString(),
        executorName: work.executorName,
        coordinates: work.coordinates,
        status: work.status,
        adress: work.adress,
        dateStart: dateFormatFromISO(work.dateOfStart?.toISOString()),
        dateEnd: dateFormatFromISO(work.dateOfEnd?.toISOString()),
        comment: work.comment,
        rejectComment: work.rejectComment,
        files: work.files?.map(file => { 
            return {
                _id: file._id.toString(),
                filename: file.filename
            }
        })
    }
    
    return {
        props: {
            session: await getSession(context),
            roadwork: data
        }
    }
}

export default AcceptDocuments