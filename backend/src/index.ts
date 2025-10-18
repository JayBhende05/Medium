import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import auth from './routes/authRoutes'
// import blog from './routes/blogRoutes'


type Env = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Env }>()

app.route('/api/v1/auth/', auth )
// app.route('/api/v1/blog', blog)


app.get('/', async (c) => {
  try {
      console.log("BBBBStarting Prisma...")
    const dbUrl = c.env.DATABASE_URL
    console.log(dbUrl);
    console.log("Starting Prisma...")

    const prisma = new PrismaClient({
      datasourceUrl: dbUrl,
    }).$extends(withAccelerate())

    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: "xyz@gmail.com",
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


export default app
