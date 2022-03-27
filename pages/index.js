import { YMaps, Map, Polyline } from 'react-yandex-maps'
import RoadWorksLinksList from '../components/roadworks/roadworksLinksList'

const Home = () => {
    return (
        <main>
            <h1 className="text-2xl mb-2">Карта дорожных работ</h1>
            <YMaps>
                <Map
                    defaultState={{
                        center: [51.786, 55.104],
                        zoom: 11,
                        autoFitToViewport: 'always'
                    }}
                    className='my-2 flex basis-3/4 grow lg:grow-0 h-96'
                >
                    {/* <Polyline
                        geometry={props.roadwork.coordinates}
                        options={{
                            balloonCloseButton: true,
                            strokeColor: '#000',
                            strokeWidth: 4,
                            strokeOpacity: 0.5
                        }}
                    /> */}
                </Map>
            </YMaps>
            <RoadWorksLinksList status="actual" className='mt-4'/>
        </main>
    )
}

export default Home
