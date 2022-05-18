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

function ChangeStatus(props) {
    const { data: session } = useSession()

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

    const onSubmit = async (e, status = 'done') => {
        let response = await getResponse(status)
        if (response.ok) {
            let json = await response.json()
            if (json.isSuccess) {
                Router.push('/profile')
            } else {
                alert(json.message || 'Ошибка при смене статуса')
            }
        } else {
            alert('Ошибка при смене статуса')
        }
    }

    if (!props.roadwork)
        return <Error errStatusCode={404} errMessage="Дорожная работа не существует"/>

    if (!isAcceptByRole(session) && !isOwnerDataSession(session, props.roadwork.customerId))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    if (!isAcceptByRole(session) && props.roadwork.status !== 'inProgress')
        return <Error errStatusCode={403} errMessage="Нет доступа"/>

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
                {props.roadwork.files && props.roadwork.files.length > 0
                &&
                    props.roadwork.files.map((file, idx) => 
                        <div key={idx} className='flex justify-between'>
                            <a href={`/api/files/${file._id}`} target="_blank" rel="noreferrer" className='block hover:text-blue-600'>
                                {`${idx + 1}. ${file.filename}`}
                            </a>
                        </div>)
                }
            </div>
            <div>
                <h1 className="text-2xl my-4">Изменить статус</h1>
                <div className='flex'>
                    <FormButton 
                    type="button" 
                    text={<div className='flex justify-center'>
                        <Image src="/check.svg" alt="" width={16} height={16} />
                        <span className='ml-2'>Выполнена</span>
                    </div>} 
                    onClick={onSubmit} 
                    className='my-2'/>
                    <FormButton 
                    type="button" 
                    text={<div className='flex justify-center'>
                        <Image src="/x.svg" alt="" width={16} height={16} />
                        <span className='ml-2'>Просрочена</span>
                    </div>} 
                    onClick={(e) => onSubmit(e, 'expired')} 
                    className='my-2'/>
                </div>
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
        customerId: work.customerId.toString(),
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

export default ChangeStatus