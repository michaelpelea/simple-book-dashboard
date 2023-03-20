import { ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import prisma from '@/services/prisma'

/**
 * Properties of model book that we want to return as response
 */
const BOOK_PROPERTIES = {
  id: true,
  author: true,
  title: true,
  isDeleted: true,
  category: true,
  createdAt: true,
  description: true,
}

/**
 * @typedef {Object} ReturnObject
 * @property {string} status - 'Success' | 'Error'
 * @property {string} message - Only available when status is Error. Explanation on the said error
 * @property {data} Object | string - Only available when status is Success. (Optional) Data requested by user
 */

/**
 * Responsible on managing CRUD operations on book model
 * Ideally, it should be accessToken with accessTokenExpiry but for now, let's keep it simple
 * @returns {ReturnObject}
 */
const booksHandler = async (req, res) => {
  const queryId = req.query?.id
  const parsedBody = req.body ? JSON.parse(req.body) : null

  if (req.method === 'GET') {
    try {
      let books
      // Check query for get. If no query, means we are requesting all books
      // If has query, then we check purpose
      if (queryId) {
        if (queryId === 'total') {
          // Get total count of not deleted books
          books = await prisma.book.count({
            where: {
              isDeleted: false,
            },
          })
        } else if (queryId === 'totalDeleted') {
          // Get total count of deleted books
          books = await prisma.book.count({
            where: {
              isDeleted: true,
            },
          })
        } else if (queryId === 'totalPerAuthor') {
          // Get all books grouped by auther and books that are not yet deleted
          books = await prisma.book.groupBy({
            by: ['author'],
            where: {
              isDeleted: false,
            },
            _count: {
              author: true,
            },
          })
        }
      } else {
        // Get all books that are not deleted
        books = await prisma.book.findMany({
          where: { isDeleted: false },
          select: BOOK_PROPERTIES,
        })
      }

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: books,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'POST' && parsedBody) {
    // Adds new record on book
    try {
      const { title, description, author, createdBy, categoryId } = parsedBody
      const book = await prisma.book.create({
        data: {
          title,
          description,
          author,
          isDeleted: false,
          user: {
            connect: {
              id: createdBy,
            },
          },
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      })

      // Once new book is added, retrieve the said book as the return result of the create func
      // Does not return the proeprties we need
      const updatedBook = await prisma.book.findFirst({
        where: { id: book.id },
        select: BOOK_PROPERTIES,
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: updatedBook,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'PUT' && queryId && parsedBody) {
    // Updates existing record on book
    try {
      const { title, description, author, categoryId } = JSON.parse(req.body) ?? {}

      // Update record
      await prisma.book.update({
        where: { id: Number(queryId) },
        data: {
          title,
          description,
          author,
          isDeleted: false,
          category: {
            connect: {
              id: categoryId,
            },
          },
        },
      })

      // Once existing book is updated, retrieve the said book as the return result of the update func
      // Does not return the proeprties we need
      const updatedBook = await prisma.book.findFirst({
        where: { id: Number(queryId) },
        select: BOOK_PROPERTIES,
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: updatedBook,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'DELETE' && queryId) {
    // Deletes existing record on book
    try {
      // Delete func
      const book = await prisma.book.update({
        where: { id: Number(queryId) },
        data: {
          isDeleted: true,
        },
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: book,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  }

  return res.status(500).json({
    status: ACTION_STATUS.ERROR,
    message: GENERIC_ERROR_MESSAGE,
  })
}

export default booksHandler
