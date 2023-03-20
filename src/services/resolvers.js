import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ROLES } from './constants'

export const LOGIN_SCHEMA_RESOLVER = yupResolver(
  yup
    .object({
      username: yup.string().min(1, 'Username is required'),
      password: yup.string().min(1, 'Password is required'),
    })
    .required()
)

export const LOGIN_DEFAULT_VALUES = {
  username: '',
  password: '',
}

export const BOOK_SCHEMA_RESOLVER = yupResolver(
  yup
    .object({
      title: yup.string().min(1, 'Title is required'),
      author: yup.string().min(1, 'Author is required'),
      description: yup.string().min(1, 'Description is required'),
      categoryId: yup.string().min(1, 'Category is required'),
    })
    .required()
)

export const BOOK_DEFAULT_VALUES = {
  title: '',
  author: '',
  description: '',
  categoryId: '',
}

export const USER_SCHEMA_RESOLVER = yupResolver(
  yup
    .object({
      firstName: yup.string().min(1, 'First name is required'),
      lastName: yup.string().min(1, 'Last name is required'),
      role: yup.string(),
      username: yup.string().min(1, 'Username is required'),
      password: yup.string().min(4, 'Password must be at least 4 characters'),
      categoryIds: yup.array(),
    })
    .required()
)

export const USER_DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  role: ROLES.USER,
  username: '',
  password: '',
  categoryIds: [],
}

export const CATEGORY_SCHEMA_RESOLVER = yupResolver(
  yup
    .object({
      name: yup.string().min(1, 'Name is required'),
    })
    .required()
)

export const CATEGORY_DEFAULT_VALUES = {
  name: '',
}
