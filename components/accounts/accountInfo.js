import LinkButton from '../common/linkButton'

const AccountInfo = (props) => {
    return (
        <div className="py-4">
            <h2 className="text-xl mb-2">Основная информация</h2>
            <div className="flex justify-between">
                <h3>Компания: {props.user.company}</h3>
                <h3>Имя: {props.user.name}</h3>
                <h3>Тип учетной записи: {props.user.role.name}</h3>
            </div>
            <LinkButton text="Редактировать" link={`/accounts/${props.user.id}/edit`} />
        </div>
    )
}

export default AccountInfo