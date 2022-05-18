import CustomLink from './customLink'
import UserLoginPanel from './userLoginPanel'

const Header = () => {
    return (
        <header className="flex items-center h-16 bg-white">
            <h1 className="mx-6 text-3xl flex justify-end content-center text-gray-900 hover:text-blue-500">
                <CustomLink href="/" title="Главная страница">PIS RoadWorks</CustomLink>
            </h1>
            <CustomLink href="/indicators" title="Показатели выполения работ отражают эффективность исполнителей" className="mx-6 flex justify-end content-center hover:text-blue-500">
                <h2>Показатели выполнения работ</h2>
            </CustomLink>
            <CustomLink href="/news" title="Новости сервиса" className="mx-6 flex justify-end content-center hover:text-blue-500">
                <h2>Новости</h2>
            </CustomLink>
            <UserLoginPanel />
        </header>
    )
}

export default Header
