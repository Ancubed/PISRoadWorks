import Error from '../components/common/error'

const Custom404 = () => {
    return <Error errStatusCode={404} errMessage="Страница не найдена" />
}

export default Custom404
