import { Hono } from 'hono'
import { getPrisma } from '../utils/prisma'
import { sign } from 'hono/jwt'


const auth = new Hono<{ Bindings: { DATABASE_URL: string, JWT_SECRET: string } }>()
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

    const payload = {
  sub: user.id,
  role: 'user',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}

    const token = await sign(payload, c.env.JWT_SECRET)

    return c.json({ msg: 'Signup successful',  token })
  } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }
})

auth.post('/signin', async (c)=>{
    
  
  try {
    const {email , password } = await c.req.json();
      if (!email?.trim() || !password?.trim() || !password?.trim()) {
      return c.json({ msg: 'Fill all the fields' }, 400)
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({
      where:{
        email : email
      }
    })

    if(!user){
      return c.json({msg : "Signup First !!"})
    }

    if(password === user.password){
      
    const payload = {
  sub: user.id,
  role: 'user',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}

    const token = await sign(payload, c.env.JWT_SECRET)

    return c.json({msg: "Signin Sucessful" , token})

    }
    
  } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }}
)


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