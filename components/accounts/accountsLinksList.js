import useSWR from 'swr'
import { useState, useEffect } from 'react'

import AccountsLink from './accountsLink'
import LinkButton from '../common/linkButton'
import LoadSpinner from '../common/loadSpinner'

import { fetcher } from '../../lib/functions'

const AccountsLinksList = (props) => {
    const { data, error } = useSWR(`/api/accounts`, fetcher)
    const [accounts, setAccounts] = useState(data)

    useEffect(() => { setAccounts(data); }, [data])

    const deleteAcc = (id) => {
        if (accounts && accounts.length != 0) {
            setAccounts(accounts.filter(acc => acc.id != id));
        }
    }

    return (
        <div className="flex grow flex-col max-w-[50%]">
            <h3 className="text-lg mb-1">Аккаунты</h3>
            {!accounts && !error && <LoadSpinner />}
            {!accounts && error && <p>Нет данных</p>}
            {accounts && <div>
                {accounts.map((acc, key) => {
                    return acc.id !== props.user.id ? (
                        <AccountsLink account={acc} key={key} user={props.user} deleteAcc={deleteAcc}/>
                    ) : null
                })}
            </div>}
            {props.user.role.id == 0 
            && 
            <LinkButton text="Добавить" link="/accounts/create" />}
        </div>
    )
}

export default AccountsLinksList
