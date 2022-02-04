import Error from '../components/error'

const Custom404 = () => {
    return <Error errStatusCode={404} errMessage="Страница не найдена" />
}

export default Custom404
