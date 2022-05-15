import CustomLink from '../common/customLink'
import { REQUEST_STATUS_ENUM, REQUEST_STATUS_COLOR } from '../../lib/constants'

const RoadworksLink = (props) => {

    const handleDeleteLinkClick = async (event) => {
        event.preventDefault();

        if(confirm('Вы уверены, что хотите удалить работу?')) {
            let response = await fetch(`/api/roadworks/${props.work.id}`, {
                method: 'delete',
                headers: {
                'Content-Type': 'application/json;charset=utf-8'
                }
            });
            let data = await response.json();
            if (response.ok && data?.isSuccess) {
                props.deleteWork(props.work.id);
            } else {
                alert(data?.message || 'В данный момент нельзя удалить заявку');
            }
        }
    }

    return (
        <div className='p-4 border-2 rounded flex justify-between'>
            <CustomLink
                href={`/roadworks/${props.work.id}`}
                className="flex grow flex-col p-1 hover:text-sky-600"
            >
                <span className="mr-4">{props.work.adress}</span>
                <span className="mr-4">{props.work.executorName}</span>
                <span className="mr-4">{`${props.work.dateStart} - ${props.work.dateEnd}`}</span>
            </CustomLink>
            <div className='flex flex-col justify-between items-end'>
                <span className={`text-sm text-gray-500`}>
                    {REQUEST_STATUS_ENUM[props.work.status]}
                </span>
                {[0,1].includes(props.user?.role?.id)
                &&
                <div>
                    <CustomLink
                        href={`/roadworks/${props.work.id}/edit`}
                        className="p-1 hover:text-sky-600"
                        title='Редактировать'
                    >
                        <span>Р.</span>
                    </CustomLink>
                    <span
                        className="p-1 cursor-pointer hover:text-sky-600"
                        onClick={handleDeleteLinkClick}
                        title='Удалить'
                    >
                        <span>У.</span>
                    </span>
                </div>}
                {[0,2].includes(props.user?.role?.id) && (props.work.status == 'new' || props.work.status == 'rejected')
                &&
                <div>
                    <CustomLink
                        href={`/roadworks/${props.work.id}/submit-document`}
                        className="p-1 hover:text-sky-600"
                        title='Загрузить или изменить документы на проведение дорожных работ'
                    >
                        <span>Загрузить документы</span>
                    </CustomLink>
                </div>}
                {[0,1].includes(props.user?.role?.id) && props.work.status == 'submitted'
                &&
                <div>
                    <CustomLink
                        href={`/roadworks/${props.work.id}/accept-document`}
                        className="p-1 hover:text-sky-600"
                        title='Проверить документы на проведение дорожных работ'
                    >
                        <span>Проверить документы</span>
                    </CustomLink>
                </div>}
                {[0,1].includes(props.user?.role?.id) && props.work.status == 'inProgress'
                &&
                <div>
                    <CustomLink
                        href={`/roadworks/${props.work.id}/change-status`}
                        className="p-1 hover:text-sky-600"
                        title='Изменить статус выполненной или просроченной дорожной работы'
                    >
                        <span>Изменить статус</span>
                    </CustomLink>
                </div>}
            </div>
        </div>
    )
}

export default RoadworksLink
