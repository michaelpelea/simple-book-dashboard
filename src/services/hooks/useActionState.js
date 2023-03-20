const { useState } = require('react')

/**
 * Simple hook that can be reused on other components/pages that focused on managing loading and message states
 * Sample usage: forms
 */
const useActionState = (initLoading = false) => {
  const [loading, setLoading] = useState(initLoading)
  const [message, setMessage] = useState('')
  const [data, setData] = useState()

  return {
    loading,
    setLoading,
    message,
    setMessage,
    data,
    setData,
  }
}

export default useActionState
