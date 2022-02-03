import Error from "../components/error";

export default function Custom404() {
    return <Error errStatusCode={404} errMessage='Страница не найдена' />
}