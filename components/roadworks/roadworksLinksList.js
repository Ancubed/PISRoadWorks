import useSWR from 'swr'
import { useState, useEffect } from 'react'

import RoadworksLink from './roadworksLink'
import LinkButton from '../common/linkButton'
import LoadSpinner from '../common/loadSpinner'

import { fetcher } from '../../lib/functions'

const RoadworksLinksList = (props) => {
    const { data, error } = useSWR(props.executor 
        ? `/api/roadworks?executor=${props.executor}` 
        : '/api/roadworks', fetcher)
    const [roadworks, setRoadworks] = useState(data)

    useEffect(() => { setRoadworks(data); }, [data])

    const deleteWork = (id) => {
        if (roadworks && roadworks.length != 0) {
            setRoadworks(roadworks.filter(work => work.id != id));
        }
    }

    return (
        <div className={`flex grow flex-col ${props.className}`}>
            <h2 className="text-xl mb-1">Дорожные работы</h2>
            {!roadworks && !error && <LoadSpinner />}
            {!roadworks && error || roadworks?.length == 0 && !error && <p>Нет данных</p>}
            {roadworks && <div>
                {roadworks.map((work, key) => {
                    return work.id !== props.user?.id ? (
                        <RoadworksLink work={work} key={key} user={props.user} deleteWork={deleteWork}/>
                    ) : null
                })}
            </div>}
            {props.user?.role?.id == 0 
            && 
            <LinkButton text="Добавить" link="/roadworks/create"/>}
        </div>
    )
}

export default RoadworksLinksList
