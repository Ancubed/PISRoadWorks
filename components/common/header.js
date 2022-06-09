import { useState } from 'react'
import CustomLink from './customLink'
import UserLoginPanel from './userLoginPanel'

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <header className="bg-white">
            <div className='hidden items-center h-16 md:flex'>
                <h1 className="mx-6 text-3xl flex justify-end content-center text-gray-900 hover:text-blue-500">
                    <CustomLink href="/" title="Главная страница">PIS RoadWorks</CustomLink>
                </h1>
                <CustomLink href="/indicators" title="Показатели выполения работ отражают эффективность исполнителей" className="mx-6 flex justify-end content-center hover:text-blue-500">
                    <h2>Показатели выполнения работ</h2>
                </CustomLink>
                <CustomLink href="/news" title="Новости сервиса" className="mx-6 flex justify-end content-center hover:text-blue-500">
                    <h2>Новости</h2>
                </CustomLink>
                <UserLoginPanel className="ml-auto mr-5 flex justify-end content-center"/>
            </div>
            <div className='flex flex-col md:hidden'>
                <div className='flex items-center justify-between w-full'>
                    <h1 className="text-3xl text-gray-900 hover:text-blue-500">
                        <CustomLink href="/" title="Главная страница">PIS RoadWorks</CustomLink>
                    </h1>
                    <div className='cursor-pointer hover:text-blue-500' onClick={() => setMobileMenu(!mobileMenu)}>Menu</div>
                </div>
                {mobileMenu && 
                    <div>
                        <CustomLink href="/indicators" title="Показатели выполения работ отражают эффективность исполнителей" className="flex hover:text-blue-500">
                            <h2>Показатели выполнения работ</h2>
                        </CustomLink>
                        <CustomLink href="/news" title="Новости сервиса" className="flex hover:text-blue-500">
                            <h2>Новости</h2>
                        </CustomLink>
                        <UserLoginPanel />
                    </div>
                }
            </div>
        </header>
    )
}

export default Header
