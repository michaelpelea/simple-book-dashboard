// Useful for having conditional classes and overriding props
export const cx = (...classes) => classes.filter(Boolean).join(' ')

// Empty functions
export const noop = () => {}
