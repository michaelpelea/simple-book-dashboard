const { default: PATHS } = require('../utils/paths')

/**
 * Responsible on calling API specifically for books
 */
const API = PATHS.API.BOOKS

export const getBooks = async () => fetch(API()).then((res) => res.json())

export const getBooksTotal = async () => fetch(API('total')).then((res) => res.json())
export const getBooksTotalDeleted = async () => fetch(API('totalDeleted')).then((res) => res.json())
export const getBooksTotalPerAuthor = async () =>
  fetch(API('totalPerAuthor')).then((res) => res.json())

export const addBook = async ({ title, author, description, userId, categoryId }) =>
  fetch(API(), {
    method: 'POST',
    body: JSON.stringify({
      title,
      author,
      description,
      createdBy: userId,
      categoryId: Number(categoryId),
    }),
  }).then((res) => res.json())

export const updateBook = async ({ bookId, title, author, description, userId, categoryId }) =>
  fetch(API(bookId), {
    method: 'PUT',
    body: JSON.stringify({
      title,
      author,
      description,
      createdBy: userId,
      categoryId: Number(categoryId),
    }),
  }).then((res) => res.json())

export const deleteBook = async (id) =>
  fetch(API(id), {
    method: 'DELETE',
  }).then((res) => res.json())
