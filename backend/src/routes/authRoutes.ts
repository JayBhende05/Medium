import { Hono } from "hono";

const auth = new Hono();
auth.post('/signup', (c) =>{ return c.text("USer is Signing up")})
auth.post('/signin', (c)=>{return c.text("User is Signing Up")})


export default auth;