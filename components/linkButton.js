import CustomLink from './customLink';

const LinkButton = (props) => {
    return (
        <CustomLink 
        href={props.link} 
        className="flex grow justify-center p-2 rounded border-2">
            {props.text || 'Открыть'}
        </CustomLink>
    )
}

export default LinkButton