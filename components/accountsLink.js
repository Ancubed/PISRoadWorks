import CustomLink from './customLink'

const AccountsLink = (props) => {
    return (
        <CustomLink
            href={`/accounts/${props.account.id}`}
            className="flex grow flex-wrap p-1 hover:text-teal-600"
        >
            <span className="mr-4">{props.account.company}</span>
            <span className="mr-4">{props.account.name}</span>
            <span className="mr-4">{props.account.role}</span>
        </CustomLink>
    )
}

export default AccountsLink
