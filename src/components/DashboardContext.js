import { getBooksTotal, getBooksTotalDeleted, getBooksTotalPerAuthor } from '@/services/api/books'

const { createContext, useCallback, useState } = require('react')

const DashboardContext = createContext()

/**
 * Context provider for the dashboard where API is stored. It is set here to allow other components
 * to refetch the dashboard data after mutation (Books)
 */
export const DashboardContextProvider = ({ children }) => {
  const [counts, setCounts] = useState({
    total: 0,
    totalDeleted: 0,
    totalPerAuthor: [],
  })

  const getBooksCount = useCallback(async () => {
    try {
      getBooksTotal().then(({ data }) => setCounts((prev) => ({ ...prev, total: data })))
    } catch (e) {}
  }, [])

  const getBooksDeletedCount = useCallback(async () => {
    try {
      getBooksTotalDeleted().then(({ data }) =>
        setCounts((prev) => ({ ...prev, totalDeleted: data }))
      )
    } catch (e) {}
  }, [])

  const getBooksPerAuthor = useCallback(async () => {
    try {
      getBooksTotalPerAuthor().then(({ data }) =>
        setCounts((prev) => ({ ...prev, totalPerAuthor: data }))
      )
    } catch (e) {}
  }, [])

  const fetchBooksDashboard = useCallback(() => {
    getBooksCount()
    getBooksDeletedCount()
    getBooksPerAuthor()
  }, [getBooksCount, getBooksDeletedCount, getBooksPerAuthor])

  return (
    <DashboardContext.Provider value={{ fetchBooksDashboard, ...counts }}>
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardContext
