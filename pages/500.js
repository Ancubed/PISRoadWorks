import Error from "../components/error";

export default function Custom500() {
    return <Error errStatusCode={500} errMessage='Страница не найдена'/>
}