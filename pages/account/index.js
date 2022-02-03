import { useSession, getSession } from 'next-auth/react'
import Error from '../../components/error'
import AdminAccount from '../../components/executorAccount'
import ExecutorAccount from '../../components/executorAccount'
import CustomerAccount from '../../components/executorAccount'

export default function Account() {
    const { data: session } = useSession()

    if (!session) return <Error errStatusCode={403} errMessage="Нет доступа" />

    switch (session.user.role) {
        case 'admin':
            return <AdminAccount />
        case 'executor':
            return <ExecutorAccount />
        case 'customer':
            return <CustomerAccount />
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
