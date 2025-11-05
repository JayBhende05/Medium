import { Hono } from 'hono'
import { getPrisma } from '../utils/prisma'


const auth = new Hono<{ Bindings: { DATABASE_URL: string } }>()
// Use the middleware
// auth.use('*', prismaMiddleware)

auth.post('/signup', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL) 

  try {
    const { name, email, password } = await c.req.json()

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return c.json({ msg: 'Fill all the fields' }, 400)
    }
    // const prisma = c.get('prisma');
    
    const user = await prisma.user.create({
      data: { name, email, password },
    })

    return c.json({ msg: 'Signup successful', user })
  } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }
})

auth.post('/signin', (c)=>{return c.text("User is Signing Up")})


auth.get('/get', async (c) => {
  try {
    // const prisma = c.get('prisma') // ✅ Access prisma from context

    // const users = await prisma.user.findMany({
    //   where: {
    //     email: {
    //       contains: "axys@gmail.com",
    //     },
    //   },
    //   cacheStrategy: { ttl: 60 },
    // })

    // return c.json(users)
  } catch (err: any) {
    console.error("Error querying users:", err)
    return c.json({ error: err.message || "Internal Server Error" }, 500)
  }
})

export default auth;