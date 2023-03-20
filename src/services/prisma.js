import { PrismaClient } from '@prisma/client'

let prisma

if (!prisma) {
  /**
   * Wrapper to hold DB connection data manipulation
   */
  prisma = new PrismaClient()
}

export default prisma
