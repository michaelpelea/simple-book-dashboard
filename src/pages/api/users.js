import { ACTION_STATUS, GENERIC_ERROR_MESSAGE } from '@/services/constants'
import prisma from '@/services/prisma'

/**
 * Properties of model user that we want to return as response
 */
const USER_PROPERTIES = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  password: true,
  role: true,
  categories: true,
}

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
const usersHandler = async (req, res) => {
  const { id = '' } = req.query
  // Only accommodate request if GET and id is not null
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: USER_PROPERTIES,
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: users,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'POST' && req.body) {
    const {
      username = '',
      password = '',
      firstName = '',
      lastName = '',
      role,
    } = JSON.parse(req.body) ?? {}
    // Adds new record on user
    try {
      const users = await prisma.user.create({
        data: {
          username,
          password,
          lastName,
          firstName,
          role,
        },
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: users,
      })
    } catch (e) {
      return res.status(500).json({
        status: ACTION_STATUS.ERROR,
        message: e.message ?? GENERIC_ERROR_MESSAGE,
      })
    }
  } else if (req.method === 'PUT' && id && req.body) {
    // Updates existing record on user
    try {
      const {
        username,
        password,
        lastName,
        firstName,
        role,
        categoryIds = [],
      } = JSON.parse(req.body) ?? {}

      // Call user categories to cross reference with the categoryIds
      const userCategories = await prisma.user.findFirst({
        where: { id },
        select: {
          categories: true,
        },
      })

      const mappedCategoryIds = categoryIds?.length ? categoryIds.map((ci) => Number(ci)) : []

      const userCategoryIds = userCategories?.categories?.map((c) => Number(c.id)) ?? []
      // Get matching values from user categories and newly submitted category Ids
      const disconnectCategories = userCategoryIds.length
        ? userCategoryIds.filter((c) => mappedCategoryIds.indexOf(c) === -1)
        : []

      // First we clean the categories if categoryIds is available because overwriting does not work with prisma
      // update with foreign keys
      await prisma.user.update({
        where: { id },
        data: {
          username,
          password,
          lastName,
          firstName,
          role,
          ...(disconnectCategories.length
            ? {
                categories: {
                  ...(disconnectCategories.length
                    ? {
                        disconnect: [...disconnectCategories.map((dc) => ({ id: dc }))],
                      }
                    : {}),
                },
              }
            : {}),
        },
        select: USER_PROPERTIES,
      })

      if (mappedCategoryIds.length) {
        await prisma.user.update({
          where: { id },
          data: {
            categories: {
              connect: [...mappedCategoryIds.map((cc) => ({ id: cc }))],
            },
          },
        })
      }

      // Get updated user as the update function does not return user with categories
      const updatedUser = await prisma.user.findFirst({
        where: { id },
        select: USER_PROPERTIES,
      })

      return res.status(200).json({
        status: ACTION_STATUS.SUCCESS,
        data: updatedUser,
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

export default usersHandler
