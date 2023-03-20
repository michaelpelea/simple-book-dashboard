import { XMarkIcon } from '@heroicons/react/24/outline'
import { PrimaryButton } from './Buttons'
import { Form } from './Forms'
import Message from './Message'

const Modal = ({ title, onClose, children, className = '', containerClassName = '' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 z-10 bg-gray-500/50 backdrop-blur" onClick={onClose} />
      <div className="relative z-20 px-5">
        <div
          className={`flex min-h-[30vh] max-w-lg flex-col rounded-lg bg-surface shadow-lg ${className}`}>
          <div className="flex items-center justify-between rounded-t-lg bg-primary p-5 text-lg capitalize text-on-primary-hover">
            {title}
            <button
              onClick={onClose}
              className="transition-smooth rounded p-1 hover:bg-primary-hover hover:text-on-primary-hover">
              <XMarkIcon className="w-5" />
            </button>
          </div>
          <div className={`p-5 ${containerClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Re-uses modal for confirmation such as delete
 */
export const DeleteModal = ({ children, message, disabled, isLoading, onConfirm, ...props }) => (
  <Modal {...props}>
    {children}
    {message && <Message {...message} />}
    <div className="flex w-full items-center justify-end">
      <PrimaryButton onClick={onConfirm} title="Delete" isLoading={isLoading} disabled={disabled} />
    </div>
  </Modal>
)

/**
 * Re-uses modal but wraps content with form
 */
export const FormModal = ({
  children,
  message,
  methods,
  disabled,
  isLoading,
  onFormSubmit,
  ...props
}) => (
  <Modal {...props}>
    <Form onSubmit={onFormSubmit}>
      {children}
      {message && <Message {...message} />}
      <PrimaryButton type="submit" title="Submit" isLoading={isLoading} disabled={disabled} />
    </Form>
  </Modal>
)

export default Modal
