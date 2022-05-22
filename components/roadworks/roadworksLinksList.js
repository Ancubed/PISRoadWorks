import useSWR from 'swr'
import { useState, useEffect } from 'react'

import RoadworksLink from './roadworksLink'
import LinkButton from '../common/linkButton'
import LoadSpinner from '../common/loadSpinner'

import { fetcher } from '../../lib/functions'

const generateUrl = (executor, customer, status, coords) => {
    let url = '/api/roadworks';
    if (executor || customer || status || coords) {
        url += '?';
        if (executor) url += `executor=${executor}${customer || status || coords ? '&' : ''}`
        if (customer) url += `customer=${customer}${status || coords ? '&' : ''}`
        if (status) url += `status=${status}${coords ? '&' : ''}`
        if (coords) url += `coords=${coords}`
    }
    return url;
}

const RoadworksLinksList = (props) => {
    const { data, error } = useSWR(generateUrl(props.executor, props.customer, props.status, props.coords), fetcher)
    const [roadworks, setRoadworks] = useState(data)

    useEffect(() => { 
        setRoadworks(data)
        if (props.updateRoadworks) 
            props.updateRoadworks(data) 
    }, [data, props])

    const deleteWork = (id) => {
        if (roadworks && roadworks.length != 0) {
            setRoadworks(roadworks.filter(work => work.id != id))
        }
    }

    return (
        <div className={`flex grow flex-col ${props.className}`}>
            <h1 className="text-2xl mb-4">Список дорожных работ</h1>
            {!roadworks && !error && <LoadSpinner />}
            {!roadworks && error || roadworks?.length == 0 && !error && <p>Нет дорожных работ</p>}
            {roadworks && <div className='-my-2'>
                {roadworks.map((work, key) => 
                    <RoadworksLink 
                        work={work} 
                        key={key} 
                        user={props.user} 
                        deleteWork={deleteWork}/>
                    )
                }
            </div>}
            {[0,1].includes(props.user?.role?.id)
            && 
            <LinkButton text="Добавить" link="/roadworks/create"/>}
        </div>
    )
}

export default RoadworksLinksList
