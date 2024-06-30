import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createToken = async (payload) => {
    try{
        const token = await jwt.sign(payload, process.env.TOKEN_SECRET)
        return token
    }
    catch(error){
        console.log(error)
    }
}

export const verifyToken = async (token) =>{
    try{
        const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET)
        return tokenVerify
    }
    catch(error){
        console.log(error)
    }
}