import useSWR from 'swr'
import { useState, useEffect } from 'react'

import RoadworksLink from './roadworksLink'
import LinkButton from '../common/linkButton'
import LoadSpinner from '../common/loadSpinner'

import { fetcher } from '../../lib/functions'

const generateUrl = (executor, customer) => {
    let url = '/api/roadworks';
    if (executor || customer) {
        url += '?';
        if (executor) {
            url += `executor=${executor}${customer ? '&' : ''}`
        }
        if (customer) {
            url += `customer=${customer}`
        }
    }
    return url;
}

const RoadworksLinksList = (props) => {
    const { data, error } = useSWR(generateUrl(props.executor, props.customer), fetcher)
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
                {roadworks.map((work, key) => 
                <RoadworksLink 
                    work={work} 
                    key={key} 
                    user={props.user} 
                    deleteWork={deleteWork}/>
                )}
            </div>}
            {[0,1].includes(props.user?.role?.id)
            && 
            <LinkButton text="Добавить" link="/roadworks/create"/>}
        </div>
    )
}

export default RoadworksLinksList
