const ExecutorAccount = (props) => {
    return (
        <>
            <h1>Executor {props.user.name}</h1>
        </>
    )
}

export async function getServerSideProps() {
    return { props: { executors: sortedExecutors } }
}

export default ExecutorAccount
