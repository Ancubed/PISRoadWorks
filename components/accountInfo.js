const AccountInfo = (props) => {

    const renderRoleTranslate = () => {
        switch (props.user.role) {
            case 'admin':
                return 'Администратор'
            case 'customer':
                return 'Заказчик'
            case 'executor':
                return 'Исполнитель'
            default:
                return 'Неизвестная роль'
        }
    }

    return (
        <div className="py-4">
            <h2 className="text-xl mb-2">Основная информация</h2>
            <div className="flex justify-between">
                <h3>Компания: {props.user.company}</h3>
                <h3>Имя: {props.user.name}</h3>
                <h3>Тип учетной записи: {renderRoleTranslate()}</h3>
            </div>
        </div>
    )
}

export default AccountInfo