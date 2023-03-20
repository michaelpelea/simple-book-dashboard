import { ACTION_STATUS } from '@/services/constants'
import prisma from '@/services/prisma'

/**
 * @typedef {Object} ReturnObject
 * @property {string} status - 'Success' | 'Error'
 * @property {string} message - Only available when status is Error. Explanation on the said error
 * @property {data} Object | string - Only available when status is Success. (Optional) Data requested by user
 */

/**
 * Validates id token set on client id
 * Ideally, it should be accessToken with accessTokenExpiry but for now, let's keep it simple
 * @returns {ReturnObject}
 */
const whoAmIHandler = async (req, res) => {
  const { id = '' } = req.query
  // Only accommodate request if GET and id is not null
  if (req.method === 'GET' && id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          firstName: true,
          lastName: true,
          role: true,
          id: true,
        },
      })

      /**
       * Return user so we can use it's details
       */
      if (user) {
        return res.status(200).json({
          status: ACTION_STATUS.SUCCESS,
          data: user,
        })
      }

      return res.status(403).json({
        status: ACTION_STATUS.ERROR,
        message: 'Invalid id.',
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message,
      })
    }
  }

  return res.status(500).json({
    status: ACTION_STATUS.ERROR,
    message: 'Something went wrong. Please try again.',
  })
}

export default whoAmIHandler
