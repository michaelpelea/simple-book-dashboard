import { setCookie } from 'cookies-next'
import { ACTION_STATUS } from '@/services/constants'
import prisma from '@/services/prisma'
import COOKIES from '@/services/utils/cookies'

/**
 * @typedef {Object} ReturnObject
 * @property {string} status - 'Success' | 'Error'
 * @property {string} message - Only available when status is Error. Explanation on the said error
 * @property {data} Object | string - Only available when status is Success. Data requested by user
 */

/**
 * Handles login request from user
 * @returns {ReturnObject}
 */
const loginHandler = async (req, res) => {
  // Only accommodate request if post
  if (req.method === 'POST') {
    try {
      const reqBody = req.body
      const parsedBody = reqBody ? JSON.parse(reqBody) : null

      // Only connect to DB if body is not empty
      if (parsedBody !== null) {
        const user = await prisma.user.findFirst({
          where: {
            username: parsedBody?.username ?? '',
            password: parsedBody?.password ?? '',
          },
        })

        if (user) {
          setCookie(COOKIES.TOKEN, user.id, { req, res, sameSite: 'lax', maxAge: 3600 }) //setting max age to 1 hour

          return res.status(200).json({
            status: ACTION_STATUS.SUCCESS,
            data: user,
          })
        }

        return res.status(403).json({
          status: ACTION_STATUS.ERROR,
          message: 'No user found.',
        })
      }
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message,
      })
    }
  }
  return response.next()
}

export default loginHandler
