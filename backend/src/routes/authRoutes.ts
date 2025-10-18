import { Hono } from "hono";
import { prismaMiddleware } from "../middleware/prismaMiddleware"
import type { PrismaType } from '../utils/prisma'


type Env = {
  DATABASE_URL: string
}

const auth = new Hono<{
  Bindings: Env
  Variables: {
    prisma: PrismaType
  }
}>()

// Use the middleware
auth.use('*', prismaMiddleware)

auth.post('/signup', (c) =>{ return c.text("USer is Signing up")})
auth.post('/signin', (c)=>{return c.text("User is Signing Up")})
auth.get('/get', async (c) => {
  try {
    const prisma = c.get('prisma') // ✅ Access prisma from context

    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: "axys@gmail.com",
        },
      },
      cacheStrategy: { ttl: 60 },
    })

    return c.json(users)
  } catch (err: any) {
    console.error("Error querying users:", err)
    return c.json({ error: err.message || "Internal Server Error" }, 500)
  }
})

export default auth;