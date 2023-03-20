const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  BOOKS: '/books',

  API: {
    LOGIN: '/api/login',
    BOOKS: (id = null, isCategory = false) =>
      `/api/books${id ? (isCategory ? `/?categories=${id}` : `/?id=${id}`) : ''}`,
    VERIFY: (id) => `/api/whoami/?id=${id}`,
    CATEGORIES: '/api/categories',
    USERS: (id = null) => `/api/users${id ? `/?id=${id}` : ''}`,
  },
}

export default PATHS
