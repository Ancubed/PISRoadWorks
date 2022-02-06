import CustomForm from '../../components/customForm'

const CreateAccount = () => {
    const fields = [
        {
            type: 'select',
            id: 'role',
            labelText: 'Тип компании',
            required: true,
            options: [
                {
                    value: '0',
                    text: 'Администратор',
                },
                {
                    value: '1',
                    text: 'Заказчик',
                },
                {
                    value: '2',
                    text: 'Исполнитель',
                },
            ],
        },
        {
            type: 'text',
            id: 'company',
            labelText: 'Название компании',
            required: true,
        },
        {
            type: 'text',
            id: 'name',
            labelText: 'Имя сотрудника',
            required: true,
            value: '',
        },
    ]

    return (
        <main>
            <h1 className="text-2xl mb-4">Создать аккаунт</h1>
            <CustomForm
                fields={fields}
                buttonText="Добавить"
                method="put"
                url="/api/accounts/create"
            />
        </main>
    )
}

export default CreateAccount
