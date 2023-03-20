import { useForm } from 'react-hook-form'
import { addCategory } from '@/services/api/categories'
import { ACTION_METHOD, ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import { CATEGORY_DEFAULT_VALUES, CATEGORY_SCHEMA_RESOLVER } from '@/services/resolvers'
import { Field } from '@/components/Forms'
import { FormModal } from '@/components/Modal'

/**
 * Form modal that focuses on allowing logged in user to create new record, update existing record and delete
 * @param {Function} onModalClose - Callback fn to close modal
 * @param {Function} onFormSuccess - Callback fn after successful form submission
 */
const CategoryForm = ({ onModalClose, onFormSuccess }) => {
  const { loading, setLoading, message, setMessage } = useActionState()
  const methods = useForm({
    resolver: CATEGORY_SCHEMA_RESOLVER,
    defaultValues: CATEGORY_DEFAULT_VALUES,
  })

  const { handleSubmit, reset } = methods

  const onFormSubmit = handleSubmit(async (formValues) => {
    setLoading(true)
    try {
      // Add sanitized formValues to api function
      const { status, message, data } = await addCategory(formValues)

      // Check status if success and data is set. If yes, call function callback to manipulate existing data
      if (status === ACTION_STATUS.SUCCESS && data) {
        onFormSuccess(ACTION_METHOD.CREATE, data)
        reset()
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
  })

  return (
    <FormModal
      title="Create Category"
      message={message}
      disabled={loading}
      isLoading={loading}
      onClose={onModalClose}
      onFormSubmit={onFormSubmit}>
      <Field disabled={loading} type="text" name="name" label="Name" methods={methods} />
    </FormModal>
  )
}

export default CategoryForm
