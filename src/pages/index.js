import Books from '@/sections/Books'
import Categories from '@/sections/Categories'
import Dashboard from '@/sections/Dashboard'
import Users from '@/sections/Users'
import { deleteCookie } from 'cookies-next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import COOKIES from '@/services/utils/cookies'
import PATHS from '@/services/utils/paths'
import { AuthContext } from '@/components/AuthGate'
import { PrimaryButton } from '@/components/Buttons'

const HomePage = () => {
  const { setSession } = useContext(AuthContext)
  const { push } = useRouter()

  // Logouts the user
  const onClickLogout = () => {
    // First delete cookie
    deleteCookie(COOKIES.TOKEN)
    // Set session null to refresh the AuthGate
    setSession(null)
    // Then we redirect to login
    push(PATHS.LOGIN)
  }

  return (
    <>
      <Head>
        <title>Emite Exam | Home</title>
      </Head>
      <main className="flex min-h-screen flex-col space-y-6 p-4 sm:space-y-10 sm:p-8">
        <div className="flex w-full justify-end">
          <PrimaryButton onClick={onClickLogout} title="Logout" />
        </div>
        <Dashboard />
        <Users />
        <Categories />
        <Books />
        <div id="modal-portal" />
      </main>
    </>
  )
}

export default HomePage
