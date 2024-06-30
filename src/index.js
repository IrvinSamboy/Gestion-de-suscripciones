import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectionSuccessfully } from './models/db.js'
import authRoutes from './routes/auth.routes.js'
import companyRoutes from './routes/companys.routes.js'
import { createRoles, createExpireDate } from './libs/serverStart.js'

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json());

const setUpServer = async () =>{
    await connectionSuccessfully()
    app.listen(PORT, ()=>{
        console.log(`Server is runnig on port ${PORT}`)
    })
}

setUpServer()
createRoles()
createExpireDate()

app.use('/api/auth', authRoutes)
app.use('/api/company', companyRoutes)