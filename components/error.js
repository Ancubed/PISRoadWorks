const Error = ({ errStatusCode, errMessage }) => {
    return (
        <h1>
            {errStatusCode || 500} - {errMessage || 'Неизвестная ошибка'}
        </h1>
    )
}

export default Error
