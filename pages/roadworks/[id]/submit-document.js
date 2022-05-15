import { useSession, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Router from 'next/router'

import Error from '../../../components/common/error'
import CustomFiles from '../../../components/common/customFiles'

import { YMaps, Map, Polyline } from 'react-yandex-maps';

import RequestModel from '../../../models/Request'
import RoadworkInfo from '../../../components/roadworks/roadworkInfo';

import { dateFormatFromISO } from '../../../lib/functions'

import { isAcceptByRole, isOwnerDataSession } from '../../../lib/functions'

function SubmitDocuments(props) {
    const { data: session } = useSession()
    const [files, setFiles] = useState(props.roadwork.files || null)

    const onSubmit = (data) => {
        if (data.isSuccess) {
            Router.push('/profile')
        } else {
            alert(data.message)
        }
    }

    const handleDeleteLinkClick = async (fileId) => {
        if(confirm('Вы уверены, что хотите удалить файл?')) {
            let response = await fetch(`/api/files/${fileId}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    filesId: [fileId],
                    roadwork: props.roadwork.id
                })
            });
            if (response.ok) {
                let json = await response.json()
                if (json.isSuccess) {
                    setFiles(files.filter(file => file._id != fileId));
                }
            }
        }
    }

    if (!props.roadwork)
        return <Error errStatusCode={404} errMessage="Дорожная работа не существует"/>

    if (!isAcceptByRole(session) && !isOwnerDataSession(session, props.roadwork.executorId))
        return <Error errStatusCode={403} errMessage="Нет доступа" />

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
            {props.roadwork.status == 'rejected' && props.roadwork.rejectComment
            &&
                <div>
                    <h1 className="text-2xl my-4">Причина отклонения</h1>
                    <div className='w-full'>
                        {props.roadwork.rejectComment}
                    </div>
                </div>
            }
            <div className=''>
                <h1 className="text-2xl my-4">Документы</h1>
                {props.roadwork.status == 'new' || props.roadwork.status == 'rejected' 
                ?
                    <>
                        <CustomFiles roadwork={props.roadwork.id} submitCallback={onSubmit}/>
                        {files && files.length > 0
                        &&
                            <div>
                                <h2 className="text-xl mb-2">Загруженные ранее</h2>
                                {files.map((file, idx) => 
                                    <div key={idx} className='flex justify-between'>
                                        <a href={`/api/files/${file._id}`} target="_blank" rel="noreferrer" className='block hover:text-sky-600'>
                                            {`${idx + 1}. ${file.filename}`}
                                        </a>
                                        <span
                                            className="p-1 cursor-pointer hover:text-sky-600"
                                            onClick={() => handleDeleteLinkClick(file._id)}
                                            title='Удалить'
                                        >
                                            <span>У.</span>
                                        </span>
                                    </div>)
                                }
                            </div>
                        }
                    </>
                :
                    <div>
                        {files && files.length > 0 
                        ?
                        files.map((file, idx) => 
                                <a href={`/api/files/${file._id}`} target="_blank" rel="noreferrer" key={idx} className='block hover:text-sky-600'>
                                    {`${idx + 1}. ${file.filename}`}
                                </a>
                            )
                        :
                            <div>Нет прикрепленных документов</div>
                        }
                    </div>
                    
                }
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

export default SubmitDocuments