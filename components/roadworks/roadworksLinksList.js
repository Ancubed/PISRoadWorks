import useSWR from 'swr'
import { useState, useEffect } from 'react'

import RoadworksLink from './roadworksLink'
import LinkButton from '../common/linkButton'
import LoadSpinner from '../common/loadSpinner'

const fetcher = async (...args) => {
    let res = await fetch(...args)
    if (!res.ok) throw new Error('Ошибка при выполнении запроса');
    let json = await res.json();
    if (!json.data) throw new Error(json.message || 'Неизвестная ошибка');
    return json.data;
}

const RoadworksLinksList = (props) => {
    const { data, error } = useSWR(`api/roadworks`, fetcher)
    const [roadworks, setRoadworks] = useState(data)

    useEffect(() => { setRoadworks(data); }, [data])

    const deleteWork = (id) => {
        if (roadworks && roadworks.length != 0) {
            setAccounts(roadworks.filter(work => work.id != id));
        }
    }

    return (
        <div className="flex grow flex-col max-w-[50%]">
            <h3 className="text-lg mb-1">Дорожные работы</h3>
            {!roadworks && !error && <LoadSpinner />}
            {!roadworks && error && <p>Нет данных</p>}
            {roadworks && <div>
                {roadworks.map((work, key) => {
                    return work.id !== props.user.id ? (
                        <RoadworksLink work={work} key={key} user={props.user} deleteWork={deleteWork}/>
                    ) : null
                })}
            </div>}
            {props.user.role.id == 0 
            && 
            <LinkButton text="Добавить" link="/roadworks/create" disable={!roadworks && !error}/>}
        </div>
    )
}

export default RoadworksLinksList
