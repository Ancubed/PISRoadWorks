const CustomForm = (props) => {
    if (!props.fields) return null

    const handleSubmit = async (event) => {
        event.preventDefault()

        const conpletedFields = Array.from(event.target.elements)

        if (conpletedFields.length < 2) throw new Error('Форма пуста')

        const data = {}

        conpletedFields.forEach((field) => {
            if (field.name) data[field.name] = field.value
        })

        console.log(data)

        // const JSONdata = JSON.stringify(data);
        // const response = await fetch(props.url, {
        //   body: JSONdata,
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   method: props.method,
        // });
    }

    const validateTextField = (field) => {}

    const validateSelectField = (field) => {
        if (!field.options || field.options.length == 0)
            throw new Error('Не задан массив options для select')
        field.options.forEach((option) => {
            if (
                !option.value ||
                typeof option.value != 'string' ||
                !option.text ||
                typeof option.text != 'string'
            )
                throw new Error('Не задан value или text для option select')
        })
    }

    const generateField = (field, key) => {
        if (!field.type || !field.id || !field.labelText)
            throw new Error('Не заданы type, id, labelText поля')

        switch (field.type) {
            case 'text':
                validateTextField(field)
                return (
                    <div key={key} className="flex flex-col mb-4">
                        <label htmlFor={field.id}>{field.labelText}</label>
                        <input
                            className="h-8"
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            required={field.required}
                            defaultValue={field.value}
                        />
                    </div>
                )
            case 'select':
                validateSelectField(field)
                return (
                    <div key={key} className="flex flex-col mb-4">
                        <label htmlFor={field.id}>{field.labelText}</label>
                        <select
                            className="h-8"
                            id={field.id}
                            name={field.id}
                            required={field.required}
                            defaultValue={field.value || field.options[0].value}
                        >
                            {field.options.map((option, key) => (
                                <option value={option.value} key={key}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            default:
                throw new Error('Неизвестный тип формы')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {props.fields.map((field, key) => generateField(field, key))}

            <button
                type="submit"
                className="flex grow w-full justify-center p-2 rounded border-2"
            >
                {props.buttonText || 'Отправить'}
            </button>
        </form>
    )
}

export default CustomForm
