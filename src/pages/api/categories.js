import { ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import prisma from '@/services/prisma'

/**
 * @typedef {Object} ReturnObject
 * @property {string} status - 'Success' | 'Error'
 * @property {string} message - Only available when status is Error. Explanation on the said error
 * @property {data} Object | string - Only available when status is Success. (Optional) Data requested by user
 */

/**
 * Responsible on managing CRUD operations on category model
 * Ideally, it should be accessToken with accessTokenExpiry but for now, let's keep it simple
 * @returns {ReturnObject}
 */
const categoriesHandler = async (req, res) => {
  const queryId = req.query?.id
  const parsedBody = req.body ? JSON.parse(req.body) : null

  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany()

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: categories,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'POST' && parsedBody) {
    // Adds new record on user
    try {
      const { name = '' } = parsedBody
      const category = await prisma.category.create({
        data: {
          name,
        },
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: category,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'PUT' && queryId && parsedBody) {
    // Updates existing record on category
    try {
      const { name = '' } = JSON.parse(req.body) ?? {}
      const category = await prisma.category.update({
        where: { id: queryId },
        data: {
          name,
        },
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: category,
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

export default categoriesHandler
