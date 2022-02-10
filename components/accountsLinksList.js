import useSWR from 'swr'
import { useState, useEffect } from 'react'

import AccountsLink from './accountsLink'
import LinkButton from './linkButton'

const fetcher = (...args) =>
    fetch(...args)
        .then((res) => res.json())
        .then((json) => json.data)

const AccountsLinksList = (props) => {
    const { data, error } = useSWR(`api/accounts`, fetcher)
    const [accounts, setAccounts] = useState(data)

    useEffect(() => { setAccounts(data); }, [data])

    if (!accounts && !error) return <p>Загрузка...</p>
    if (!accounts) return <p>Нет данных</p>

    const deleteAcc = (id) => {
        if (accounts && accounts.length != 0) {
            setAccounts(accounts.filter(acc => acc.id != id));
        }
    }

    return (
        <div className="flex grow flex-col">
            <h3 className="text-lg mb-1">Аккаунты</h3>
            <div>
                {accounts.map((acc, key) => {
                    return acc.id !== props.user.id ? (
                        <AccountsLink account={acc} key={key} user={props.user} deleteAcc={deleteAcc}/>
                    ) : null
                })}
            </div>
            <LinkButton text="Добавить" link="accounts/create" />
        </div>
    )
}

export default AccountsLinksList
