import { SessionProvider } from 'next-auth/react'

import HeadContainer from '../components/common/headContainer'
import Header from '../components/common/header'
import Footer from '../components/common/footer'

import '../styles/globals.css'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <div className="bg-gray-100 text-gray-500">
                <HeadContainer />
                <Header />

                <Component {...pageProps} />

                <Footer />
            </div>
        </SessionProvider>
    )
}

export default MyApp
