import Link from 'next/link'

const CustomLink = (props) => {
    let { href, children, ...rest } = props;
    
    return (
        <Link href={href}>
            <a {...rest}>{children}</a>
        </Link>
    )
}

export default CustomLink
