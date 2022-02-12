import Error from '../components/common/error'

const Custom500 = () => {
    return <Error errStatusCode={500} errMessage="Страница не найдена" />
}

export default Custom500
