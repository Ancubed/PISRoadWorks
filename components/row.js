import { useState } from 'react'

const Row = ({
    companyName,
    total,
    done,
    inProgress,
    expired,
    grade,
    isHeader,
}) => {
    const [row, setRow] = useState({
        companyName,
        total,
        done,
        inProgress,
        expired,
        grade,
    })

    return (
        <tr className={isHeader ? 'font-bold h-12' : 'h-10'}>
            <td>{row.companyName}</td>
            <td className="text-center">{row.total}</td>
            <td className="text-center">{row.done}</td>
            <td className="text-center">{row.inProgress}</td>
            <td className="text-center">{row.expired}</td>
            <td className="text-center">{row.grade}</td>
        </tr>
    )
}

export default Row
