import Head from 'next/head';
import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className='px-40'>
      <Head>
        <title>PISRoadWorks</title>
        <meta name="description" content="Организация дорожных работ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='flex m-[-1.25rem] items-center h-32'>
        <h1 className='m-5 text-3xl'>
          <Link href='/'>
            <a>PIS RoadWorks</a>
          </Link>
        </h1>
        <Link href='/indicators'>
          <a className='m-5'>
            <h2>Показатели выполнения работ</h2>
          </a>
        </Link>
      </header>

        <Component {...pageProps} />

      <footer className='mt-24'>
          Powered by  
          <a
          href="https://github.com/Ancubed"
          target="_blank"
          rel="noopener noreferrer"
          > Andrew Antonov</a>
      </footer>
    </div>
  );
}

export default MyApp
