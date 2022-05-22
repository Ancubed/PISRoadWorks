import Image from 'next/image';
import CustomLink from '../common/customLink'

const AccountsLink = (props) => {

    const handleDeleteLinkClick = async (event) => {
        event.preventDefault();

        if(confirm('Вы уверены, что хотите удалить аккаунт?')) {
            let response = await fetch(`/api/accounts/${props.account.id}`, {
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
        <div className='p-4 border-2 rounded-2xl my-2 flex justify-between'>
            <CustomLink
                href={`/accounts/${props.account.id}`}
                className="flex grow flex-col p-1 hover:text-blue-600"
            >
                <span className="mr-4">{props.account.company}</span>
                <span className="mr-4">{props.account.name}</span>
                <span className="mr-4">{props.account.role}</span>
            </CustomLink>
            <div className='flex flex-col justify-end'>
                {props.user?.role?.id == 0 
                &&
                <div>
                    <CustomLink
                        href={`/accounts/${props.account.id}/edit`}
                        className="p-1 hover:text-blue-600"
                        title='Редактировать'
                    >
                        <Image src="/pencil.svg" alt="Р." width={16} height={16} />
                    </CustomLink>
                    <span
                        className="p-1 cursor-pointer hover:text-blue-600"
                        onClick={handleDeleteLinkClick}
                        title='Удалить'
                    >
                        <Image src="/trash.svg" alt="У." width={16} height={16} />
                    </span>
                </div>}
            </div>  
        </div>
    )
}

export default AccountsLink
