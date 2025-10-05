import { Hono } from "hono";

const blog = new Hono();
blog.post('/', (c) => {return c.text("Blog Uploaded")})
blog.put('/', (c) => {return c.text("Blog Editied")})
blog.get('/:id' , (c) => { const {id} = c.req.param()
return c.text(`User with id ${id}`)})
blog.get('/bulk', (c) =>{ c.text("Blogs are presented in Blulk") })


export default blog