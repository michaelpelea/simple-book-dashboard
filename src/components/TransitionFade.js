import { Transition } from '@headlessui/react'

/**
 * Combined with popup components that adds a bit of animation on show of the child element
 */
const TransitionFade = ({ isShown, children, className = '', beforeLeave, afterLeave }) => (
  <Transition
    show={isShown}
    enter="transition duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    beforeLeave={beforeLeave}
    afterLeave={afterLeave}
    className={className}>
    {children}
  </Transition>
)

export default TransitionFade
