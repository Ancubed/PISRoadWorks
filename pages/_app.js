import { SessionProvider } from 'next-auth/react'

import HeadContainer from '../components/headContainer'
import Header from '../components/header'
import Footer from '../components/footer'

import '../styles/globals.css'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <div className="px-2 md:px-40">
                <HeadContainer />
                <Header />

                <Component {...pageProps} />

                <Footer />
            </div>
        </SessionProvider>
    )
}

export default MyApp
