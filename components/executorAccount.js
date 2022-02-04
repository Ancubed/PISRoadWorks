const ExecutorAccount = (props) => {
    return (
        <div>
            <h1>Executor {props.user.name}</h1>
        </div>
    )
}

export async function getServerSideProps() {
    
    return { props: { executors: sortedExecutors } }
}

export default ExecutorAccount
