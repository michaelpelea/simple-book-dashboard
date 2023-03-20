import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo } from 'react'
import { ACTION_STATUS, ROLES } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import COOKIES from '@/services/utils/cookies'
import PATHS from '@/services/utils/paths'
import Spinner from './Spinner'

export const AuthContext = createContext()

/**
 * Responsible on checking the authentication session of the user if logged in or not
 * Once verified, we store the session via createContext so it's accessible to the parts of the page
 * The token is set using the model User id. Ideally, we should be using accessToken with expiration but
 * for simplicity's sake, use id for now and store via cookie
 * Note: Cookie expires every hour and is set via /api/login
 */
const AuthGate = ({ children }) => {
  const router = useRouter()
  const { pathname, push } = router
  const { loading, setLoading, setData: setSession, data: session } = useActionState()

  useEffect(() => {
    const init = async () => {
      // Show loading
      setLoading(true)
      try {
        // Retrieve token id from cookie
        const cookieTokenId = getCookie(COOKIES.TOKEN)

        // Only connect to API if cookie value is set
        if (cookieTokenId) {
          const data = await fetch(PATHS.API.VERIFY(cookieTokenId)).then((res) => res.json())

          if (data?.status === ACTION_STATUS.SUCCESS && data?.data) {
            // We now set to true to continue with the website
            setSession(data.data)
            // let's prevent the code from moving forward as we have accomplished the verification
            return
          }
        }

        // Only push when not on login
        if (pathname !== PATHS.LOGIN) push(PATHS.LOGIN)
      } catch (e) {
        // Something went wrong. Let's have user re-enter credentials
        // Only push when not on login
        if (pathname !== PATHS.LOGIN) push(PATHS.LOGIN)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [pathname])

  const isUserAdmin = useMemo(() => session?.role === ROLES.ADMIN, [session?.role])

  if (loading) {
    return <Spinner size={6} />
  }

  /**
   * We only check if session is available. If no session is still available, we show spinner as we are requesting
   * to api. If a session is invalid, the useEffect is responsible on redirecting user to the login route
   */
  return (
    <AuthContext.Provider value={{ session, isUserAdmin, setSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthGate
