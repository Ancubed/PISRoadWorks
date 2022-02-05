import { useState, useEffect } from "react"

const AccountsLinksList = (props) => {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
  
    useEffect(() => {
        setLoading(true)
        fetch('api/accounts')
            .then((res) => res.json())
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
    }, [])
  
    if (isLoading) return <p>Загрузка...</p>
    if (!data) return <p>Нет данных</p>
  
    return (
        <div className="">
            {data.toString()}
        </div>
    )
}

export default AccountsLinksList