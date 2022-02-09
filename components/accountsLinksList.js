import useSWR from 'swr'

import AccountsLink from './accountsLink'
import LinkButton from './linkButton'

const fetcher = (...args) =>
    fetch(...args)
        .then((res) => res.json())
        .then((json) => json.data)

const AccountsLinksList = (props) => {
    const { data, error } = useSWR(`api/accounts`, fetcher)

    if (!data && !error) return <p>Загрузка...</p>
    if (!data) return <p>Нет данных</p>

    return (
        <div className="flex grow flex-col">
            <h3 className="text-lg mb-1">Аккаунты</h3>
            <div>
                {data.map((acc, key) => {
                    return acc.id !== props.user.id ? (
                        <AccountsLink account={acc} key={key} />
                    ) : null
                })}
            </div>
            <LinkButton text="Добавить" link="accounts/create-account" />
        </div>
    )
}

export default AccountsLinksList
