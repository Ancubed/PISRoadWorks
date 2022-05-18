const FormButton = (props) => {
    return (
        <button
            disabled={props.disable}
            type={props.type}
            className={`flex grow w-full justify-center p-2 rounded border-2 hover:text-blue-600${props.className ? ` ${props.className}` : ''}`}
            onClick={props.onClick}
        >
            {props.text || 'Отправить'}
        </button>
    )
}

export default FormButton
