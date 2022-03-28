import express from 'express'
import { router } from './routes'
import cors from 'cors'

const app = express()
app.use(express.json({limit: '25mb'}))
app.use(cors({
	origin: '*'
}))
app.use(express.urlencoded({limit: '25mb'}))
app.use(router)


export { app }
