import CustomLink from "./customLink"

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

const Row = ({ 
    companyId = null,
    companyName = 'Скрытая компания',
    total = 0, 
    done = 0, 
    inProgress = 0, 
    expired = 0, 
    grade = 0, 
    isHeader = false 
}) => {
    return (
        <tr className={isHeader ? 'font-bold h-12' : 'h-10'}>
            <td>
                <CustomLink 
                    href={companyId ? `/accounts/${companyId}` : '#'}
                    className="flex grow flex-col p-1 hover:text-sky-600"
                >
                    {companyName}
                </CustomLink>
            </td>
            <td className="text-center">{total}</td>
            <td className="text-center">{done}</td>
            <td className="text-center">{inProgress}</td>
            <td className="text-center">{expired}</td>
            <td className="text-center">{grade}</td>
        </tr>
    )
}

export default Row
