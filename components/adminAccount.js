import AccountsLinksList from './accountsLinksList'
import RoadWorksLinksList from './roadworksLinksList'

const AdminAccount = (props) => {
    return (
        <div className="py-4">
            <h2 className="text-xl mb-2">Панель управления</h2>
            <div className="flex justify-between">
                <AccountsLinksList user={props.user} />
                <RoadWorksLinksList user={props.user} />
            </div>
        </div>
    )
}

export default AdminAccount
