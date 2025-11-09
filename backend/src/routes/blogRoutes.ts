import { Hono } from "hono";
import { userMiddleware } from "../middleware/userMiddleware";
import { Bindings } from "hono/types";
import { getPrisma } from "../utils/prisma";

const blog = new Hono<{Bindings : {
  DATABASE_URL : string
},Variables : {
  userId : string
}}>();

blog.use(userMiddleware);


blog.post('/post' , async (c) =>{
  try {
    const body = await c.req.json()
  const {title, content } = body;
  const userId = c.get('userId');

  const prisma = getPrisma(c.env.DATABASE_URL)


  if(!title?.trim() || !content?.trim()){
    return c.json({msg : "Required Fileds Missing" })
    }

    const blog = await prisma.blog.create({
      data:{
        title : title,
        content :content,
        authorId : userId
      }
    })

    if(!blog){
      return c.json({msg : "Error at DB"})
    }
  return c.json({ msg : "Blog Created Successfully", blogId : blog.id})
  
} catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }
})


blog.put('/post', async (c) => { 
  try {
     const body = await c.req.json();
     const {id, title, content} = body
     const prisma = getPrisma(c.env.DATABASE_URL);

     if(!id?.trim()){
      console.log(id)
      return c.json({msg: "Try Again !!"})
     }

     if(!title?.trim() || !content?.trim()){
      return c.json({msg: "Fields Missing"})
     }

     const updatedBlog = await prisma.blog.update({
      where:{
        id : id
      },data:{
        title : title,
        content: content
      }
     })

     if(!updatedBlog){
      return c.json({msg : "Error in Updating Blog"})
     }

     return c.json({msg: "Blog Successfully Updated", blogId : updatedBlog.id})
  
} catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  } })


blog.get('/:id' ,async (c) => { 
  try {
    const id = c.req.param('id');
    
    if(!id){
      return c.json({msg: "Try Agaain !!"})
    }

    const prisma = await getPrisma(c.env.DATABASE_URL);  

    const blog =  await prisma.blog.findFirst({
      where:{
        id : id
      }
    })

    if(!blog){
      return c.json({msg: "Blog not found !!"})
    }

    return c.json({msg : "Blog Found !!", data : blog})
    
  } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  }

})




blog.get('',async (c) =>{  try {
    console.log("Hit")
    const prisma = await getPrisma(c.env.DATABASE_URL);  

    const blog =  await prisma.blog.findMany({})

    if(!blog){
      return c.json({msg: "Blogs not found !!"})
    }

    return c.json({msg : "Blog Found !!", data : blog})
    
  } catch (error: any) {
    console.error(error)
    return c.json({
      msg: 'Error Occurred',
      error: error.message || JSON.stringify(error),
    })
  } })


export default blog