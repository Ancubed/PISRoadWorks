import { useSession, getSession } from 'next-auth/react'

const ExecutorAccount = () => {
    const { data: session } = useSession()
    
    return (
        <main>
            <h1>Customer protected Page {session.user.name}</h1>
            <p>You can view this page because you are signed in.</p>
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

export default ExecutorAccount
