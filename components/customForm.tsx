import { useState } from "react";

interface Field {
    type: string,
    id: string,
    labelText: string,
    required: boolean,
    value?: string,
}

interface Option {
    value: string,
    text: string,
}

interface SelectField extends Field {
    options: [Option]
}

type AnyField = Field | SelectField;

interface CustomFormProps {
    fields: AnyField[],
    buttonText: string,
    method: string // Заменить на enum
    url: string
}

interface Data {
    [propName: string]: string;
}

const CustomForm = (props: CustomFormProps) => {

    const [error, setError] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const [message, setMessage] = useState(false)

    if (!props.fields) throw new Error('Не передан props fields')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()

            const completedFields = Array.from(event.currentTarget.elements)

            if (completedFields.length < 2) throw new Error('Форма пуста')

            const data: Data = {};

            completedFields.forEach((field) => {
                let name = (field as HTMLInputElement).name;
                let value = (field as HTMLInputElement).value;
                if (name) data[name] = value;
            })

            const JSONdata = JSON.stringify(data);
            const response = await fetch(props.url, {
                body: JSONdata,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: props.method,
            });
            if (!response.ok) throw new Error(`Ошибка ${response.status} - ${response.statusText}`)

            let json = await response.json();

            if (!json) throw new Error('Сервер не отправил ответ');

            if (!json.isSuccess) throw new Error(json.message || 'Непредвиденная ошибка');

            setError(false);
            setSuccess(true);
            setMessage(json.message || '');
        } catch(err) {
            setSuccess(false);
            setError(true);
            setMessage(err.message);
        }
    }

    const generateField = (field: AnyField, key: any) => {
        if (!field.type || !field.id || !field.labelText)
            throw new Error('Не задан type, id или labelText')

            return (
                <div key={key} className="flex flex-col mb-4">
                        <label htmlFor={field.id}>{field.labelText}</label>
                        {
                            (field.type == 'text' || field.type == 'password') 
                            &&  
                            <input
                                className="h-8"
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                defaultValue={field.value}
                            />
                        }
                        {
                            field.type == 'select' 
                            && 
                            <select
                                className="h-8"
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                defaultValue={field.value || field.options[0].value}
                            >
                                {field.options.map((option: Option, key: any) => (
                                    <option value={option.value} key={key}>
                                        {option.text}
                                    </option>
                                ))}
                            </select>
                        }
                </div>
            )
    }

    return (
        <form 
        onSubmit={handleSubmit} 
        className={`p-4 border-2 rounded ${error && 'border-rose-500'} ${isSuccess && 'border-green-500'}`}>
            {props.fields.map((field, key) => generateField(field, key))}
            {message 
            && 
            <span 
            className={`flex justify-center my-4 ${error && 'text-rose-500'} ${isSuccess && 'text-green-500'}`}>
                {message}
            </span>}
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
