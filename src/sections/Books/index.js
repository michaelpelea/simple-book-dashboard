import { lazy, useCallback, useContext, useEffect, useState } from 'react'
import { ACTION_METHOD, ACTION_STATUS, DEFAULT, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import PATHS from '@/services/utils/paths'
import { AuthContext } from '@/components/AuthGate.js'
import Card from '@/components/Card.js'
import { CategoryContext } from '@/components/CategoryContext.js'
import DashboardContext from '@/components/DashboardContext.js'
import Section from '@/components/Section.js'

// Lazy load the modal as we don't need it asap on screen
const BookFormModal = lazy(() => import('./BookForm.js'))

/**
 * Categories section that manages the viewing, creating and updating of records
 * Should only be viewable by ADMIN role or
 * Users with assigned categories which will filter books accordingly
 */
const Books = () => {
  // check session from AuthContext in AuthGate
  const { session, userCategoryIds, isUserAdmin } = useContext(AuthContext)
  const { fetchBooksDashboard } = useContext(DashboardContext)
  // Get all categories set on the categories section
  const { categories } = useContext(CategoryContext)
  const { data, setData, message, setMessage, loading, setLoading } = useActionState()
  /**
   * Set modal properties where show flags the visibility of the modal on screen and type dictates the mode of action
   * for the form. The data property is used to hold the data that we want to send to the modal for update and delete purposes
   */
  const [modal, setModal] = useState({
    show: false,
    type: '',
    data: null,
  })

  // Calls available books
  const getBooks = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch books according to categories of the user and role
      // If current user role is USER, then we add the categories we want to filter the books with
      const { data, message, status } = await fetch(
        isUserAdmin ? PATHS.API.BOOKS() : PATHS.API.BOOKS(encodeURIComponent(userCategoryIds), true)
      ).then((res) => res.json())

      // Set data only if status of response is success
      if (status === ACTION_STATUS.SUCCESS) {
        if (data?.length > 0) {
          setData(data)
        } else {
          setMessage({
            type: DEFAULT,
            message: 'No books found.',
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
  }, [setData, setLoading, setMessage, isUserAdmin, userCategoryIds])

  /**
   * Adds the newly added or updated data on existing record to prevent the need or calling API again
   * Similar on manipulating cache
   */
  const onFormSuccess = (method, data) => {
    if (method === ACTION_METHOD.CREATE) {
      // Just add the data on the list
      setData((prev) => [...(prev ?? []), data])
    } else if (method === ACTION_METHOD.UPDATE) {
      setData((prev) => {
        // find existing data first
        const bookIndex = prev.findIndex((b) => b.id === data.id)
        // Overwrite
        prev[bookIndex] = data

        return [...prev]
      })
    } else if (method === ACTION_METHOD.DELETE) {
      // Remove the item from the list
      setData((prev) => prev.filter((b) => b.id !== data.id))
    }

    // Refetch dashboard only if admin as this component is viewable to the said role only
    if (isUserAdmin) {
      fetchBooksDashboard()
    }
    onExitBookModal()
  }

  const onClickCreateBook = useCallback(
    () => setModal({ type: ACTION_METHOD.CREATE, show: true }),
    []
  )

  const onExitBookModal = useCallback(() => setModal({ type: '', show: false, data: null }), [])

  const onClickEditBook = useCallback((book) => {
    setModal({ type: ACTION_METHOD.UPDATE, show: true, data: book })
  }, [])

  const onClickDeleteBook = useCallback(
    (book) => setModal({ type: ACTION_METHOD.DELETE, show: true, data: book }),
    []
  )

  useEffect(() => {
    ;(async () => getBooks())()
  }, [getBooks])

  // Even if this is available to both ADMIN and USER
  // Only render this if session is valid
  return session ? (
    <Section
      title="Books"
      buttonText="Create new book"
      loading={loading}
      message={message}
      showModal={modal.show}
      onCreateButtonClick={onClickCreateBook}
      modalComponent={() => (
        <BookFormModal
          book={modal.data}
          type={modal.type}
          userId={session.id}
          categories={(isUserAdmin ? categories : session?.categories ?? []) ?? []}
          onFormSuccess={onFormSuccess}
          onModalClose={onExitBookModal}
        />
      )}
      data={data}
      dataMapper={({ id, title, author, description, createdAt, category }) => (
        <Card
          key={id}
          onDeleteButtonClick={() =>
            onClickDeleteBook({ id, title, author, description, createdAt, category })
          }
          onEditButtonClick={() =>
            onClickEditBook({ id, title, author, description, createdAt, category })
          }
          rows={[
            ['Title: ', title],
            ['Author: ', author],
            ['Description: ', description],
            ['Created At: ', new Date(createdAt).toDateString('en-US')],
            ['Category: ', category?.id ? category?.name : 'N/A'],
          ]}
        />
      )}
    />
  ) : null
}

export default Books
