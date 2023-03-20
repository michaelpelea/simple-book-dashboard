import { cx } from '@/services/utils'
import Spinner from './Spinner'

export const PrimaryButton = ({ title, className, isLoading, children, ...rest }) => (
  <button
    type="button"
    className={cx(
      'transition-smooth disabled:text-muted-variant relative inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary-hover shadow-sm outline-none hover:bg-primary-hover focus:z-10 disabled:cursor-not-allowed disabled:bg-muted',
      className
    )}
    {...rest}>
    {/* Adding for flexibility on adding icons on the button while allowing children or simple title only */}
    {isLoading ? <Spinner size={6} /> : children ?? title}
  </button>
)
