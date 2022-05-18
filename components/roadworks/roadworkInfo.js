import CustomLink from '../common/customLink'
import { REQUEST_STATUS_ENUM, REQUEST_STATUS_COLOR } from '../../lib/constants'

const RoadworkInfo = ({ className = '', roadwork }) => {
    return (
        <div className={`${className} flex flex-col`}>
            <h1 className="text-2xl mb-4">Основная информация</h1>
            <div className="flex flex-col">
                <div className="my-2">
                    <h2 className="text-xl">Исполнитель</h2>
                    <CustomLink
                        href={`/accounts/${roadwork.executorId}`}
                        className="hover:text-blue-600 text-lg"
                    >
                        {roadwork.executorName}
                    </CustomLink>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Статус</h2>
                    <span className="text-lg">{REQUEST_STATUS_ENUM[roadwork.status]}</span>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Адрес</h2>
                    <span className="text-lg">{roadwork.adress}</span>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Дата начала работ</h2>
                    <span className="text-lg">{roadwork.dateStart}</span>
                </div>
                <div className="my-2">
                    <h2 className="text-xl">Дата окончания работ</h2>
                    <span className="text-lg">{roadwork.dateEnd}</span>
                </div>
            </div>
        </div>
    )
}

export default RoadworkInfo
