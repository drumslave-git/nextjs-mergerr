import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logger'

const prisma = new PrismaClient()

prisma.app.findMany().then(apps => {
  logger.info(`Found ${apps.length} apps:`)
  for (const app of apps) {
    logger.info(app.name)
  }
})

export {prisma}