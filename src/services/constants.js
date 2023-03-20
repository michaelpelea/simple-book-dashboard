/**
 * Used on any action that requires response to user
 */
export const SUCCESS = 'Success'
export const WARNING = 'Warning'
export const ERROR = 'Error'
export const DEFAULT = 'Default'

export const ACTION_STATUS = {
  SUCCESS,
  WARNING,
  ERROR,
}

/**
 * Used on identifying user action
 */
export const CREATE = 'create'
export const UPDATE = 'update'
export const DELETE = 'delete'

export const ACTION_METHOD = {
  CREATE,
  UPDATE,
  DELETE,
}

/**
 * Used on user roles
 */
export const ADMIN = 'ADMIN'
export const USER = 'USER'

export const ROLES = {
  ADMIN,
  USER,
}

/**
 * Used for showing generic errors to users in case specific error is not available
 */
export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'
