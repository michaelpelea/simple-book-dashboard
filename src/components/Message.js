import { ACTION_STATUS, DEFAULT } from '@/services/constants'
import { cx } from '@/services/utils'

/**
 * Returns message component for displaying useful information to users regarding failed, successful fetch or actions
 * @param {String} type - 'default' | 'error' | 'warning' | 'success' that controls the theme of the component
 * @param {String} message - Message to be displayed to user
 * @param {string} className - overrides wrapper styling
 * @returns {Component}
 */
const Message = ({ type = 'Default', message, className }) => (
  <div
    className={cx(
      'rounded-md p-4',
      type === ACTION_STATUS.ERROR && 'bg-red-100 text-red-500',
      type === DEFAULT && 'bg-surface text-paragraph',
      type === ACTION_STATUS.WARNING && 'bg-orange-50 text-warning',
      type === ACTION_STATUS.SUCCESS && 'bg-success text-green-500',
      className
    )}>
    {type !== DEFAULT && <h5 className="font-bold capitalize">{type}!</h5>}
    {message}
  </div>
)

export default Message
