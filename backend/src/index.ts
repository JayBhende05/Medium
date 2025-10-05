import { Hono } from 'hono'
import auth from './routes/authRoutes'
import blog from './routes/blogRoutes'

const app = new Hono()

app.route('/api/v1/auth/', auth )
app.route('/api/v1/blog', blog)

export default app
