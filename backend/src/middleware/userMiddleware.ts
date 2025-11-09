import { MiddlewareHandler } from "hono";
import { verify } from 'hono/jwt'

// const tokenToVerify = 'token'
// const secretKey = 'mySecretKey'

// const decodedPayload = await verify(tokenToVerify, secretKey)
// console.log(decodedPayload)


export const userMiddleware: MiddlewareHandler = async (c,next) =>{
  

   try {
    const token = c.req.header('Authorization')
  const JWT_SECRET = c.env.JWT_SECRET
  if(!token){
    return c.json({msg : " Missing Authorization Header, Can't Access !!! "})
  }

  // const tokenToVerify = token.split(' ')[1]

  const decodedPayload = await verify(token, JWT_SECRET);

  if(!decodedPayload){
    return c.json({msg : "Signin Again !!"})
  }

  console.log(decodedPayload);
  c.set('userId', decodedPayload.sub )

   await next();
   } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }

}
