import { lazy, useCallback, useContext, useEffect, useState } from 'react'
import { getUsers } from '@/services/api/users.js'
import { ACTION_METHOD, ACTION_STATUS, DEFAULT, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import { AuthContext } from '@/components/AuthGate.js'
import Card from '@/components/Card.js'
import { CategoryContext } from '@/components/CategoryContext.js'
import Section from '@/components/Section.js'

// Lazy load this as we don't need it asap on page
const UserFormModal = lazy(() => import('./UserForm.js'))

/**
 * Users section that manages the viewing, creating and updating of records
 * Should only be viewable by ADMIN role
 */
const Users = () => {
  // check session from AuthContext in AuthGate
  const { isUserAdmin } = useContext(AuthContext)
  const { categories: categoriesData } = useContext(CategoryContext)
  const { data, setData, message, setMessage, loading, setLoading } = useActionState()
  const [modal, setModal] = useState({
    show: false,
    type: ACTION_METHOD.CREATE,
    data: null,
  })

  // Fetches all users from DB
  const getAllUsers = useCallback(async () => {
    // Show loading to indicate connection to API
    setLoading(true)
    try {
      const { data, message, status } = await getUsers()

      // Set data only if status of response is success
      if (status === ACTION_STATUS.SUCCESS) {
        // Set data; show no data available if data is empty
        if (data?.length > 0) {
          setData(data)
        } else {
          setMessage({
            type: DEFAULT,
            message: 'No user(s) found.',
          })
        }
      } else {
        setMessage({
          type: ACTION_STATUS.ERROR,
          message: message ?? GENERIC_ERROR_MESSAGE,
        })
      }
    } catch (e) {
      setMessage({
        type: ACTION_STATUS.ERROR,
        message: e?.message ?? GENERIC_ERROR_MESSAGE,
      })
    } finally {
      setLoading(false)
    }
  }, [setData, setLoading, setMessage])

  /**
   * Opens modal with type create
   */
  const onClickCreateUser = useCallback(
    () => setModal({ show: true, type: ACTION_METHOD.CREATE, data: null }),
    []
  )

  /**
   * Opens modal with type edit
   */
  const onEditButtonClick = useCallback(
    (user) => setModal({ show: true, type: ACTION_METHOD.UPDATE, data: user }),
    []
  )

  /**
   * Closes modal
   */
  const onExitModal = useCallback(() => setModal({ show: false, type: '', data: null }), [])

  /**
   * Callback function that manipulates existing data with new update record from form submission
   * @param {String} method - ACTION_METHOD.CREATE | ACTION_METHOD.UPDATE | ACTION_METHOD.DELETE
   * @param {Object} data - data to be added to the existing records
   */
  const onFormSuccess = (method, data) => {
    if (method === ACTION_METHOD.CREATE) {
      setData((prev) => [...prev, data])
    } else if (method === ACTION_METHOD.UPDATE) {
      setData((prev) => {
        // find existing data first
        const userIndex = prev.findIndex((b) => b.id === data.id)
        // Overwrite
        prev[userIndex] = data

        return [...prev]
      })
    }
    onExitModal()
  }

  useEffect(() => {
    ;(async () => getAllUsers())()
  }, [getAllUsers])

  return isUserAdmin ? (
    <Section
      title="Users"
      buttonText="Create new user"
      loading={loading}
      message={message}
      onCreateButtonClick={onClickCreateUser}
      showModal={modal.show}
      modalComponent={() => (
        <UserFormModal
          user={modal.data}
          type={modal.type}
          categories={categoriesData}
          onFormSuccess={onFormSuccess}
          onModalClose={onExitModal}
        />
      )}
      data={data}
      dataMapper={({ id, firstName, username, password, lastName, role, categories }) => (
        <Card
          key={id}
          onEditButtonClick={() =>
            onEditButtonClick({ id, firstName, lastName, username, password, role, categories })
          }
          rows={[
            ['Name: ', `${firstName} - ${lastName}`],
            ['Role: ', role],
            ['Category: ', categories?.length ? categories.map((c) => c.name).join(',') : 'N/A'],
          ]}
        />
      )}
    />
  ) : (
    <div />
  )
}

export default Users
