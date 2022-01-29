import CustomLink from '../components/customLink';
import UserLoginPanel from '../components/userLoginPanel';

const Header = () => {
    return (
        <header className='flex -m-5 items-center h-32'>
          <h1 className='m-5 text-3xl'>
            <CustomLink href='/'>
              PIS RoadWorks
            </CustomLink>
          </h1>
          <CustomLink href='/indicators' className='m-5'>
              <h2>Показатели выполнения работ</h2>
          </CustomLink>
          <UserLoginPanel />
        </header>
    )
}

export default Header;