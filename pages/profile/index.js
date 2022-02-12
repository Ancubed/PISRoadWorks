import { useSession, getSession } from 'next-auth/react'
import Error from '../../components/common/error'
import AdminAccount from '../../components/accounts/adminAccount'
import CustomerAccount from '../../components/accounts/customerAccount'
import ExecutorAccount from '../../components/accounts/executorAccount'
import AccountInfo from '../../components/accounts/accountInfo'

const Account = () => {
    const { data: session } = useSession()

    if (!session || !session.user)
        return <Error errStatusCode={403} errMessage="Нет доступа" />

    const renderSwitchedAccount = () => {
        switch (session.user.role.id) {
            case 0:
                return <AdminAccount user={session.user} />
            case 1:
                return <CustomerAccount user={session.user} />
            case 2:
                return <ExecutorAccount user={session.user} />
            default:
                return (
                    <Error
                        errStatusCode={403}
                        errMessage="Не определена роль. Обратитесь к администратору для получения подробной информации"
                    />
                )
        }
    }

    return (
        <main>
            <h1 className="text-2xl mb-4">Личный кабинет</h1>
            <AccountInfo user={session.user} />
            {renderSwitchedAccount()}
        </main>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getSession(context),
        },
    }
}

export default Account
