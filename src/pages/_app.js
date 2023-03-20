import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import AuthGate from '@/components/AuthGate'
import CategoryContextProvider from '@/components/CategoryContext'
import { DashboardContextProvider } from '@/components/DashboardContext'

const inter = Inter({ subsets: ['latin'] })

const NextApp = ({ Component, pageProps }) => {
  return (
    <AuthGate>
      <DashboardContextProvider>
        <CategoryContextProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </CategoryContextProvider>
      </DashboardContextProvider>
    </AuthGate>
  )
}

export default NextApp
