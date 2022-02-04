import { useSession, getSession } from 'next-auth/react'
import Error from '../../components/error'
import AdminAccount from '../../components/adminAccount'
import CustomerAccount from '../../components/customerAccount'
import ExecutorAccount from '../../components/executorAccount'

export default function Account() {
    const { data: session } = useSession()

    if (!session) return <Error errStatusCode={403} errMessage="Нет доступа" />

    switch (session.user.role) {
        case 'admin':
            return <AdminAccount user={session.user}/>
        case 'customer':
            return <CustomerAccount user={session.user}/>
        case 'executor':
            return <ExecutorAccount user={session.user}/>
        default:
            return (
                <Error
                    errStatusCode={403}
                    errMessage="Не определена роль. Обратитесь к администратору для получения подробной информации"
                />
            )
    }
}

export async function getServerSideProps(context) {
    return {
        props: {
            session: await getSession(context),
        },
    }
}
