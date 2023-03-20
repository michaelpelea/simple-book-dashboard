const { default: PATHS } = require('../utils/paths')

const LOGIN_API = PATHS.API.LOGIN
const VERIFY_API = PATHS.API.VERIFY

/**
 * Handles login and verification
 */

export const getUser = async ({ username, password }) =>
  fetch(LOGIN_API, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json())

export const verifyUser = async (id) =>
  fetch(VERIFY_API(id), {
    method: 'GET',
  }).then((res) => res.json())
