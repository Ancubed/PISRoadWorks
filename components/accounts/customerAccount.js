import RoadWorksLinksList from '../../components/roadworks/roadworksLinksList'

const CustomerAccount = (props) => {
    return (
        <div className=''>
            <RoadWorksLinksList customer={props.user.id} user={props.user} />
        </div>
    )
}

export default CustomerAccount
