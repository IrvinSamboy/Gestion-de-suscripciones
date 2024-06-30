import db from '../models/db.js'
import bcrypt from 'bcrypt'
import { createToken } from '../libs/token.js'

export const singUp = async (req, res) =>{

    const {userName, pass, rol} = req.body
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);    

    try{
        if(rol) {
            const roles = await db.select('idRol').where('roleName', rol).from('roles').first()
            if(!roles) return res.status(404).json({message: "Rol no encontrado"})
            console.log(roles)
            const user = await db('users').insert({userName: userName, pass: hashedPassword, idRol: roles.idRol})
            return res.status(201).json({message: user});
         }
         else{
            const roles = await db.select('idRol').where('roleName', 'user').from('roles').first()
            console.log(roles.idRol)
            const user = await db('users').insert({userName: userName, pass: hashedPassword, idRol: roles.idRol})
            return res.status(201).json({message: user});
         }         
    }
    catch (error){
        console.log(error)
    }
}

export const singIn = async (req, res) =>{
    const {userName, pass} = req.body

    try{
        const user = await db.select('*').where('userName', userName).from('users').first()
        if(!user) res.status(404).json({message: "Usuario no encontrado"})
        const verifyPass = await bcrypt.compare(pass, user.pass)
        if(!verifyPass) return res.status(404).json({message: "Contraseña incorrecta"})
        const token = await createToken(JSON.stringify(user))
        return res.status(200).cookie('token', token, {httpOnly: true}).json({message: 'Logged in'});
    } 
    catch(error){
        console.log(error)
    }
}