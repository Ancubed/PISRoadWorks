import Head from 'next/head';
import Image from 'next/image';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>PISRoadWorks</title>
        <meta name="description" content="Организация дорожных работ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Component {...pageProps} />

      <footer>
       
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
