/**
 * Строка таблицы
 * @param {*} props - isHeader - Заголовок ли эта строка
 * @param {*} props - companyName - Название компании
 * @param {*} props - total - Всего
 * @param {*} props - done - Выполнено
 * @param {*} props - inProgress - В процессе выполнения
 * @param {*} props - expired - Просрочено
 * @param {*} props - grade - Оценка показателей
 * @returns
 */

const Row = (props) => {
    return (
        <tr className={props.isHeader ? 'font-bold h-12' : 'h-10'}>
            <td>{props.companyName}</td>
            <td className="text-center">{props.total}</td>
            <td className="text-center">{props.done}</td>
            <td className="text-center">{props.inProgress}</td>
            <td className="text-center">{props.expired}</td>
            <td className="text-center">{props.grade}</td>
        </tr>
    )
}

export default Row
