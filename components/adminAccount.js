const AdminAccount = (props) => {    
    return (
        <main>
            <h1>Customer protected Page {props.user.name}</h1>
            <p>You can view this page because you are signed in.</p>
        </main>
    )
}

export default AdminAccount
