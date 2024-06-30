import {verifyToken} from '../libs/token.js'
import db from '../models/db.js'
const checkAuth = (rol) => async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token) return res.status(404).json({message: "Sin autorización"})
        const tokenVerify = await verifyToken(token)
        if(!tokenVerify) return res.status(404).json({message: "Sin autorización"})
        if(!rol) return next()
        const idRol = await db.select('idRol').where('roleName', rol).from('roles').first()
        const veriFyRole = tokenVerify.idRol === idRol.idRol
        if(!veriFyRole) return res.status(404).json({message: "Sin autorización"})
        next()

    }
    catch(error){
        console.log(error)
    }
}

export default checkAuth