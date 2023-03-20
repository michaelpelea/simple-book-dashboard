import { useContext, useEffect } from 'react'
import { AuthContext } from '@/components/AuthGate'
import Card from '@/components/Card'
import DashboardContext from '@/components/DashboardContext'

const Dashboard = () => {
  const { isUserAdmin } = useContext(AuthContext)
  const { total, totalDeleted, totalPerAuthor, fetchBooksDashboard } = useContext(DashboardContext)

  useEffect(() => {
    fetchBooksDashboard()
  }, [fetchBooksDashboard])

  return isUserAdmin ? (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Dashboard</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card
          rows={[
            ['Total Books Created: ', total],
            [
              'Note: ',
              'Count in this card shows books that have not been deleted or isDeleted set to false.',
            ],
          ]}
        />
        <Card
          rows={[
            ['Total Books Deleted: ', totalDeleted],
            [
              'Note: ',
              'Count in this card shows books that have been deleted or isDeleted set to true.',
            ],
          ]}
        />
        <Card>
          <span className="text-sm font-bold">
            Total Books Per Author: (not deleted or isDeleted set to false)
          </span>
          <div className="flex flex-col space-y-2">
            {totalPerAuthor?.map(({ _count, author }) => (
              <span key={author}>{`${author} has ${_count.author} `}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  ) : null
}

export default Dashboard
