
import { MiddlewareHandler } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prismaMiddleware: MiddlewareHandler = async (c, next) => {
  const dbUrl = c.env.DATABASE_URL

  const prisma = new PrismaClient({
    datasourceUrl: dbUrl,
  }).$extends(withAccelerate())

  // Attach prisma client to context variables
  c.set('prisma', prisma)

  await next()
}
