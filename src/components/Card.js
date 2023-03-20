import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'

const BUTTON_CLASS = 'outline-none border-none cursor-pointer'
/**
 * Card display component used on displaying records of the section
 * If children is present, replace rows
 */
const Card = ({ onEditButtonClick, onDeleteButtonClick, rows = [], children }) => (
  <div className="flex flex-col space-y-2 rounded-md bg-white p-4 shadow-lg">
    <div className="flex w-full flex-row items-center justify-end space-x-2">
      {onEditButtonClick && (
        <button className={BUTTON_CLASS} onClick={onEditButtonClick}>
          <PencilSquareIcon width={20} />
        </button>
      )}
      {onDeleteButtonClick && (
        <button className={BUTTON_CLASS} onClick={onDeleteButtonClick}>
          <TrashIcon width={20} />
        </button>
      )}
    </div>
    <div className="space-y-2">
      {children ??
        rows.map(([label, value]) => (
          <div key={`${label}-${value}`} className="space-x-1 text-sm">
            <span className="font-bold text-paragraph">{label}</span>
            {value}
          </div>
        ))}
    </div>
  </div>
)

export default Card
