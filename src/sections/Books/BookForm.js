import { useForm } from 'react-hook-form'
import { addBook, deleteBook, updateBook } from '@/services/api/books'
import { ACTION_METHOD, ACTION_STATUS, WARNING } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import { BOOK_DEFAULT_VALUES, BOOK_SCHEMA_RESOLVER } from '@/services/resolvers'
import { Field, RadioField } from '@/components/Forms'
import Message from '@/components/Message'
import { DeleteModal, FormModal } from '@/components/Modal'

/**
 * Form modal that focuses on allowing logged in user to create new record, update existing record and delete
 * @param {Object | null} book - Preloaded data from existing books
 * @param {String} type - ACTION_METHOD.CREATE | ACTION_METHOD.UPDATE | ACTION_METHOD.DELETE
 * @param {Array} categories - Categories used to fill out category field
 * @param {String} userId - Current id of the logged in user
 * @param {Function} onModalClose - Callback fn to close modal
 * @param {Function} onFormSuccess - Callback fn after successful form submission
 */
const BookForm = ({
  book = null,
  type = ACTION_METHOD.CREATE,
  categories,
  userId,
  onModalClose,
  onFormSuccess,
}) => {
  const { loading, setLoading, message, setMessage } = useActionState()
  // As for the defaultValues, we are checking for book availability before using BOOK_DEFAULT_VALUES
  // This allows flexibility on setting the form with preloaded data for updating record
  const methods = useForm({
    resolver: BOOK_SCHEMA_RESOLVER,
    defaultValues: book
      ? {
          title: book.title ?? '',
          author: book.author ?? '',
          description: book.description ?? '',
          categoryId: book.category.id ?? '',
        }
      : BOOK_DEFAULT_VALUES,
  })

  const { handleSubmit, reset } = methods

  // Handles form submission for create, update and delete
  const onFormSubmit = handleSubmit(async (formValues) => {
    setLoading(true)
    try {
      let data

      // Handle API accordingly based from component type
      // Add sanitized formValues to api function
      if (type === ACTION_METHOD.CREATE) {
        data = await addBook({ userId, ...formValues })
      } else if (type === ACTION_METHOD.UPDATE) {
        data = await updateBook({ bookId: book.id, userId, ...formValues })
      } else if (type === ACTION_METHOD.DELETE) {
        data = await deleteBook(book.id)
      }

      // Check status if success and data is set. If yes, call function callback to manipulate existing data
      if (data?.status === ACTION_STATUS.SUCCESS && data?.data) {
        onFormSuccess(type, data.data)
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
      setLoading(false)
    }
  })

  // If type is delete, show delete modal immediately
  if (type === ACTION_METHOD.DELETE) {
    return (
      <DeleteModal
        title={`${type} Book`}
        message={message}
        disabled={loading}
        isLoading={loading}
        onClose={onModalClose}
        onConfirm={onFormSubmit}>
        <div className="flex flex-col space-y-5">
          <Message
            type={WARNING}
            message="This is to confirm your decision to delete the record selected. Please be reminded that the system won't be able to recover once confirmed."
          />
          <p>
            Are you sure to delete <b>{book.title ?? book.id ?? ''}</b>?
          </p>
        </div>
      </DeleteModal>
    )
  }

  // Set to condition to make sure the form is shown as needed only
  return type === ACTION_METHOD.CREATE || type === ACTION_METHOD.UPDATE ? (
    <FormModal
      title={`${type} Book`}
      message={message}
      disabled={loading}
      isLoading={loading}
      onClose={onModalClose}
      onFormSubmit={onFormSubmit}>
      <Field disabled={loading} type="text" name="title" label="Title" methods={methods} />
      <Field disabled={loading} type="text" name="author" label="Author" methods={methods} />
      <Field
        disabled={loading}
        type="text"
        name="description"
        label="Description"
        methods={methods}
      />
      {categories?.length > 0 && (
        <RadioField
          label="Category"
          name="categoryId"
          disabled={loading}
          methods={methods}
          values={[...categories.map(({ id, name }) => [name, id])]}
        />
      )}
    </FormModal>
  ) : null
}

export default BookForm
