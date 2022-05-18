import AccountsLinksList from './accountsLinksList'
import RoadWorksLinksList from '../roadworks/roadworksLinksList'

const AdminAccount = (props) => {
    return (
        <div className="py-4">
            <h1 className="text-2xl mb-4">Панель управления</h1>
            <div className="-m-4 flex justify-between flex-col lg:flex-row">
                <AccountsLinksList user={props.user} className='m-4 mb-8 lg:mb-0 lg:basis-1/2'/>
                <RoadWorksLinksList user={props.user} className='m-4 lg:basis-1/2'/>
            </div>
        </div>
    )
}

export default AdminAccount
