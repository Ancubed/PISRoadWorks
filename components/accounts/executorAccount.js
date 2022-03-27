import RoadWorksLinksList from '../../components/roadworks/roadworksLinksList'

const ExecutorAccount = (props) => {
    return (
        <div className=''>
            <RoadWorksLinksList executor={props.user.id} user={props.user} />
        </div>
    )
}

export default ExecutorAccount
