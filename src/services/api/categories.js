const { default: PATHS } = require('../utils/paths')

const API = PATHS.API.CATEGORIES

/**
 * Responsible on calling API specifically for categories
 */
export const getCategories = async () => fetch(API).then((res) => res.json())

export const addCategory = async ({ name }) =>
  fetch(API, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
  }).then((res) => res.json())
