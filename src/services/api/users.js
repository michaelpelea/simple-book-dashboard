const { default: PATHS } = require('../utils/paths')

const API = PATHS.API.USERS

/**
 * Responsible on calling API specifically for users
 */
export const getUsers = async () => fetch(API()).then((res) => res.json())

export const addUser = async ({ username, password, firstName, lastName, role }) =>
  fetch(PATHS.API.USERS(), {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      firstName,
      lastName,
      role,
    }),
  }).then((res) => res.json())

export const updateUser = async ({
  userId,
  username,
  password,
  firstName,
  lastName,
  role,
  categoryIds,
}) =>
  fetch(PATHS.API.USERS(userId), {
    method: 'PUT',
    body: JSON.stringify({
      username,
      password,
      firstName,
      lastName,
      role,
      categoryIds,
    }),
  }).then((res) => res.json())
