import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { getUser } from '@/services/api/login'
import { ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import useActionState from '@/services/hooks/useActionState'
import { LOGIN_DEFAULT_VALUES, LOGIN_SCHEMA_RESOLVER } from '@/services/resolvers'
import PATHS from '@/services/utils/paths'
import { PrimaryButton } from '@/components/Buttons'
import { Field, Form } from '@/components/Forms'
import Message from '@/components/Message'

const LoginPage = () => {
  const router = useRouter()
  const { loading, setLoading, message, setMessage } = useActionState()
  const methods = useForm({
    resolver: LOGIN_SCHEMA_RESOLVER,
    defaultValues: LOGIN_DEFAULT_VALUES,
  })

  const { handleSubmit, reset } = methods

  // handleSubmit wraps the onSubmit function where it sanitize the value based from the yup resolver set on the services/constants
  const onSubmit = handleSubmit(async (formValue) => {
    // Show spinner and disable form
    setLoading(true)
    try {
      await getUser(formValue).then((account) => {
        if (account?.status !== ACTION_STATUS.SUCCESS) {
          setMessage(account?.message ?? GENERIC_ERROR_MESSAGE)
        } else {
          setMessage('')
          router.push(PATHS.HOME)
        }
      })
    } catch (e) {
      // Something went wrong with the api login request
      setMessage(e?.message ?? GENERIC_ERROR_MESSAGE)
    } finally {
      // Always remove spinner after request regardless of success or fail
      setLoading(false)
      reset() //Don't forget to reset the form values
    }
  })

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-md border-2 border-muted p-4">
        <Form onSubmit={onSubmit}>
          <Field
            disabled={loading}
            type="text"
            label="Username"
            name="username"
            methods={methods}
          />
          <Field
            disabled={loading}
            type="password"
            label="Password"
            name="password"
            methods={methods}
          />
          {message && <Message type={ACTION_STATUS.ERROR} message={message} />}
          <PrimaryButton type="submit" title="Submit" disabled={loading} isLoading={loading} />
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
