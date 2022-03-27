import CustomLink from './customLink'

const LinkButton = (props) => {
    return (
        <CustomLink
            href={props.link}
            className="flex grow-0 justify-center mt-4 p-2 rounded border-2 hover:text-sky-600"
        >
            {props.text || 'Открыть'}
        </CustomLink>
    )
}

export default LinkButton
