import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { forwardRef } from 'react'
import { cx } from '@/services/utils'

/**
 * Wrapper for the field elements combined together
 */
export const FieldGroup = ({ children, className }) => <div className={className}>{children}</div>

/**
 * Show the label of the input
 */
export const FieldLabel = ({ name, title }) => (
  <div className="mb-1 flex">
    <label htmlFor={name} className="block text-sm font-medium text-paragraph">
      {title}
    </label>
  </div>
)

/**
 * Show the error from the yup
 */
export const FieldError = ({ title, description }) => (
  <div className="pt-1 text-sm text-red-600">
    {title && <h3>{title}</h3>}
    {description}
  </div>
)

/**
 * Field input with yup integration
 */
export const FieldInput = forwardRef(function FieldInputRef(
  { name, type = 'text', methods, className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      name={name}
      id={name}
      className={cx(
        'block w-full rounded-md border-muted bg-surface text-paragraph shadow-sm focus:border-primary focus:ring-primary group-[.invalid]:border-red-300 group-[.invalid]:text-red-900 group-[.invalid]:placeholder-red-300 group-[.invalid]:focus:border-red-500 group-[.invalid]:focus:outline-none group-[.invalid]:focus:ring-red-500 sm:text-sm',
        className
      )}
      {...methods.register(name)}
      {...rest}
    />
  )
})

/**
 * Returns a radio input field that is wrapped with yup resolver function
 * @param {Array} values - [[x, y]] where x is the label of the field and y is the value of the radio
 */
export const RadioField = forwardRef(function RadioFieldRef(
  { label, values = [], name, className, methods, ...rest },
  ref
) {
  const value = methods.getValues(name)
  return (
    <FieldGroup className={cx(methods.formState.errors[name] ? 'invalid' : '', 'group')}>
      {label && <FieldLabel title={label} />}
      <div className="grid grid-cols-2">
        {values.map(([l, v]) => (
          <div className="flex flex-row items-center gap-2" key={`${l}-${v}`}>
            <input
              ref={ref}
              type="radio"
              name={name}
              id={l}
              value={v}
              defaultChecked={v === value}
              className={cx('mb-1', className)}
              {...methods.register(name)}
              {...rest}
            />
            {l && <FieldLabel title={l} name={name} />}
          </div>
        ))}
      </div>

      {methods.formState.errors[name] && (
        <FieldError description={methods.formState.errors[name]?.message} />
      )}
    </FieldGroup>
  )
})

/**
 * Returns a radio input field that is wrapped with yup resolver function
 * @param {Array} values - [[x, y]] where x is the label of the field and y is the value of the radio
 */
export const CheckboxField = forwardRef(function CheckboxFieldRef(
  { label, values = [], name, className, methods, ...rest },
  ref
) {
  const value = methods.getValues(name)

  return (
    <FieldGroup className={cx(methods.formState.errors[name] ? 'invalid' : '', 'group')}>
      {label && <FieldLabel title={label} />}
      <div className="grid grid-cols-2">
        {values.map(([l, v]) => (
          <div className="flex flex-row items-center gap-2" key={`${l}-${v}`}>
            <input
              ref={ref}
              type="checkbox"
              name={name}
              id={l}
              value={v}
              defaultChecked={value.some((existingValue) => existingValue === v)}
              className={cx('mb-1', className)}
              {...methods.register(name)}
              {...rest}
            />
            {l && <FieldLabel title={l} name={name} />}
          </div>
        ))}
      </div>

      {methods.formState.errors[name] && (
        <FieldError description={methods.formState.errors[name]?.message} />
      )}
    </FieldGroup>
  )
})

/**
 * Component that is responsible on working with the useForm hook methods. Make sure this is inside the form
 */
export const Field = forwardRef(function FieldRef(
  { label, name, type = 'text', methods, ...rest },
  ref
) {
  return (
    <FieldGroup className={cx(methods.formState.errors[name] ? 'invalid' : '', 'group')}>
      {label && <FieldLabel title={label} name={name} />}
      <div className="relative">
        <FieldInput ref={ref} type={type} name={name} methods={methods} {...rest} />
        {methods.formState.errors[name] && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {methods.formState.errors[name] && (
        <FieldError description={methods.formState.errors[name]?.message} />
      )}
    </FieldGroup>
  )
})

/**
 * Form component that wraps form into a re-usable component for singular css styling
 */
export const Form = ({ className, ...rest }) => (
  <form {...rest} className={cx('space-y-4', className)} />
)
