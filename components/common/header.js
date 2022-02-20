import CustomLink from './customLink'
import UserLoginPanel from './userLoginPanel'

const Header = () => {
    return (
        <header className="flex -mx-5 items-center h-24">
            <h1 className="mx-5 text-3xl flex justify-end content-center">
                <CustomLink href="/">PIS RoadWorks</CustomLink>
            </h1>
            <CustomLink href="/indicators" className="mx-5 flex justify-end content-center">
                <h2>Показатели выполнения работ</h2>
            </CustomLink>
            <UserLoginPanel />
        </header>
    )
}

export default Header
