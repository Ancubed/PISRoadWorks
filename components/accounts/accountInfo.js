import Image from 'next/image'
import LinkButton from '../common/linkButton'

const AccountInfo = (props) => {
    return (
        <div className="py-4">
            <h2 className="text-xl mb-4">Основная информация</h2>
            <div className="flex justify-between">
                <h3>Компания: {props.user.company}</h3>
                <h3>Имя: {props.user.name}</h3>
                <h3>Тип учетной записи: {props.user.role.name}</h3>
            </div>
            <LinkButton 
            text={<div className='flex justify-center'>
                <Image src="/pencil.svg" alt="Р." width={16} height={16} />
                <span className='ml-2'>Редактировать</span>
            </div>} 
            link={`/accounts/${props.user.id}/edit`} 
            />
        </div>
    )
}

export default AccountInfo
