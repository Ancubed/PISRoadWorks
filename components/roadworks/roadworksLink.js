import CustomLink from '../common/customLink'

const RoadworksLink = (props) => {

    const handleDeleteLinkClick = async (event) => {
        event.preventDefault();

        if(confirm('Вы уверены, что хотите удалить аккаунт?')) {
            let response = await fetch(`/api/roadworks/${props.account.id}`, {
                method: 'delete',
                headers: {
                'Content-Type': 'application/json;charset=utf-8'
                }
            });
            if (response.ok) {
                props.deleteAcc(props.account.id);
            }
        }
    }

    return (
        <div className='p-4 border-2 rounded flex justify-between'>
            <CustomLink
                href={`/accounts/${props.account.id}`}
                className="flex grow flex-col p-1 hover:text-teal-600"
            >
                <span className="mr-4">{props.account.company}</span>
                <span className="mr-4">{props.account.name}</span>
                <span className="mr-4">{props.account.role}</span>
            </CustomLink>
            {props.user.role.id == 0 
            &&
            <div>
                <CustomLink
                    href={`/accounts/${props.account.id}/edit`}
                    className="p-1 hover:text-teal-600"
                >
                    <span>Р.</span>
                </CustomLink>
                <span
                    className="p-1 cursor-pointer hover:text-teal-600"
                    onClick={handleDeleteLinkClick}
                >
                    <span>У.</span>
                </span>
            </div>}
        </div>
    )
}

export default RoadworksLink
