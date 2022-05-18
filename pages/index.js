import { useState } from 'react'

import { YMaps, Map, Polyline } from 'react-yandex-maps'

import RoadWorksLinksList from '../components/roadworks/roadworksLinksList'

const Home = () => {

    const [roadworks, setRoadworks] = useState(null)

    return (
        <main>
            <h1 className="text-2xl mb-4">Карта дорожных работ</h1>
            <YMaps>
                <Map
                    defaultState={{
                        center: [51.786, 55.104],
                        zoom: 11,
                        autoFitToViewport: 'always'
                    }}
                    className='my-2 flex basis-3/4 grow lg:grow-0 h-96'
                >
                    {roadworks && roadworks.map((roadwork, key) => 
                    <Polyline
                        modules={['geoObject.addon.balloon']}
                        key={key}
                        geometry={roadwork.coordinates}
                        properties={{
                            balloonContentHeader: `Работа №${roadwork.id}`,
                            balloonContent: `
                            <p>Исполнитель: 
                                <a href="/accounts/${roadwork.id}">${roadwork.executorName}</a>
                            </p>
                            <p>Адрес: ${roadwork.adress}</p>
                            <p>Дата проведения: ${roadwork.dateStart} - ${roadwork.dateEnd}</p>
                            <p>
                              <a href="/roadworks/${roadwork.id}" style="color:#0284c7">Подробнее</a>
                            </p>
                        `
                        }}
                        options={{
                            balloonCloseButton: true,
                            strokeColor: '#000',
                            strokeWidth: 4,
                            strokeOpacity: 0.5
                        }}
                    />
                    )}
                </Map>
            </YMaps>
            <RoadWorksLinksList status="inProgress" coords={true} updateRoadworks={setRoadworks} className='mt-4'/>
        </main>
    )
}

export default Home
