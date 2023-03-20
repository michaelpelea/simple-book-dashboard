import { lazy, useCallback, useContext, useEffect, useState } from 'react'
import { ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import PATHS from '@/services/utils/paths'
import { AuthContext } from '@/components/AuthGate.js'
import { CategoryContext } from '@/components/CategoryContext.js'
import Section from '@/components/Section.js'

const CategoryFormModal = lazy(() => import('./CategoryForm.js'))

/**
 * Categories section that manages the viewing, creating and updating of records
 * Should only be viewable by ADMIN role
 */
const Categories = () => {
  // check session from AuthContext in AuthGate
  const { isUserAdmin } = useContext(AuthContext)
  const { categories, setCategories } = useContext(CategoryContext)
  const { message, setMessage, loading, setLoading } = useActionState()
  const [showAddModal, setShowAddModal] = useState(false)

  // Calls available categories
  const getCategories = useCallback(async () => {
    setLoading(true)
    try {
      const { data, message, status } = await fetch(PATHS.API.CATEGORIES).then((res) => res.json())

      // Set data only if status of response is success
      if (status === ACTION_STATUS.SUCCESS) {
        if (data?.length > 0) {
          setCategories(data)
        } else {
          setMessage({
            type: 'default',
            message: 'No categories found.',
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
  }, [setCategories, setLoading, setMessage])

  /**
   * Adds the newly added or updated data on existing record to prevent the need or calling API again
   * Similar on manipulating cache
   */
  const onFormSuccess = (method, data) => {
    if (method === 'create') {
      setCategories((prev) => [...(prev ?? []), data])
      onExitCreateCategoryModal()
    }
  }

  const onClickCreateCategory = useCallback(() => setShowAddModal(true), [])

  const onExitCreateCategoryModal = useCallback(() => setShowAddModal(false), [])

  useEffect(() => {
    ;(async () => getCategories())()
  }, [getCategories])

  return isUserAdmin ? (
    <Section
      title="Categories"
      buttonText="Create new category"
      loading={loading}
      message={message}
      onCreateButtonClick={onClickCreateCategory}
      showModal={showAddModal}
      modalComponent={() => (
        <CategoryFormModal onFormSuccess={onFormSuccess} onModalClose={onExitCreateCategoryModal} />
      )}
      data={categories}
      dataMapper={({ id, name }) => (
        <div key={id} className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-lg">
          <div className="space-x-1 text-sm">
            <span className="font-bold text-paragraph">{name}</span>
          </div>
        </div>
      )}
    />
  ) : null
}

export default Categories
