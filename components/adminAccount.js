import AccountsLinksList from './accountsLinksList'

const AdminAccount = (props) => {
    return (
        <div className="py-4">
            <h2 className="text-xl mb-2">Панель управления</h2>
            <div className="flex justify-between">
                <AccountsLinksList user={props.user} />
                <div>
                    <h3 className="text-lg mb-1">Дорожные работы</h3>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default AdminAccount
