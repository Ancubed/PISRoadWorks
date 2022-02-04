import { useState } from 'react'

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
