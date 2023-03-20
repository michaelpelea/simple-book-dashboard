import { useForm } from 'react-hook-form'
import { addUser, updateUser } from '@/services/api/users'
import { ACTION_METHOD, ACTION_STATUS, GENERIC_ERROR_MESSAGE, ROLES } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import { USER_DEFAULT_VALUES, USER_SCHEMA_RESOLVER } from '@/services/resolvers'
import { CheckboxField, Field, RadioField } from '@/components/Forms'
import { FormModal } from '@/components/Modal'

/**
 * Form modal that focuses on allowing logged in user to create new record
 * @param {Object | null} user - Preloaded data from existing books
 * @param {String} type - ACTION_METHOD.CREATE | ACTION_METHOD.UPDATE | ACTION_METHOD.DELETE
 * @param {Array} categories - Categories used to fill out category field
 * @param {Function} onModalClose - Callback fn to close modal
 * @param {Function} onFormSuccess - Callback fn after successful form submission
 */
const UserForm = ({ user, type, categories, onFormSuccess, onModalClose }) => {
  const { loading, setLoading, message, setMessage } = useActionState()
  // Handles the sanitizing of the fields based on the resolver
  // Set default values as well
  const methods = useForm({
    resolver: USER_SCHEMA_RESOLVER,
    defaultValues: user
      ? {
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          role: user?.role ?? ROLES.USER,
          username: user?.username ?? '',
          password: user?.password ?? '',
          categoryIds: user?.categories?.map((c) => c.id) ?? [],
        }
      : USER_DEFAULT_VALUES,
  })

  const { handleSubmit, reset } = methods

  const onFormSubmit = handleSubmit(async (formValues) => {
    // Show loading to indicate connection to API
    setLoading(true)
    try {
      let data

      // Add sanitized formValues to api function
      if (type === ACTION_METHOD.CREATE) {
        data = await addUser(formValues)
      } else if (type === ACTION_METHOD.UPDATE) {
        data = await updateUser({ userId: user.id, ...formValues })
      }

      // Check status if success and data is set. If yes, call function callback to manipulate existing data
      if (data?.status === ACTION_STATUS.SUCCESS && data?.data) {
        onFormSuccess(type, data.data)

        // Don't forget to reset values
        reset()
      } else {
        setMessage({
          type: ACTION_STATUS.ERROR,
          message: data?.message ?? GENERIC_ERROR_MESSAGE,
        })
      }
    } catch (e) {
      setMessage({
        type: ACTION_STATUS.ERROR,
        message: e?.message ?? GENERIC_ERROR_MESSAGE,
      })
    } finally {
      // Always make sure to set loading to false
      setLoading(false)
    }
  })

  return (
    <FormModal
      title={`${type} User`}
      disabled={loading}
      isLoading={loading}
      message={message}
      onClose={onModalClose}
      onFormSubmit={onFormSubmit}>
      <Field disabled={loading} type="text" name="username" label="Username" methods={methods} />
      <Field
        disabled={loading}
        type="password"
        name="password"
        label="Password"
        methods={methods}
      />
      <Field disabled={loading} type="text" name="firstName" label="First Name" methods={methods} />
      <Field disabled={loading} type="text" name="lastName" label="Last Name" methods={methods} />
      <RadioField
        values={[
          ['Admin', ROLES.ADMIN],
          ['User', ROLES.USER],
        ]}
        disabled={loading}
        label="Role"
        name="role"
        methods={methods}
      />
      {categories?.length && (
        <CheckboxField
          values={[...categories.map(({ id, name }) => [name, id])]}
          disabled={loading}
          label="Category"
          name="categoryIds"
          methods={methods}
        />
      )}
    </FormModal>
  )
}

export default UserForm
