import path from 'path'
import express from 'express'
import helmet from 'helmet'

const app = express()
app.set('trust proxy', true)

app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))

export default app
