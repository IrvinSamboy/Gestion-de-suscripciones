import db from '../models/db.js'

export const createRoles = async () => {
    try{
        const roles = await db.select('*').from('roles')

        if(roles.length !== 0) return 
    
        const newRoles = await Promise.all([
            db('roles').insert({roleName: 'admin'}),
            db('roles').insert({roleName: 'user'})
        ])
        console.log(newRoles)
    }
    catch(error){
        console.log(error)
    }

}

export const createExpireDate = async () => {
    try{
        const expireDate = await db.select('*').from('expireDate')

        if(expireDate.length !== 0) return 
    
        const newExpireDate = await Promise.all([
            db('expiredate').insert({nameExpire: '1 mes', expireDate: 30}),
            db('expiredate').insert({nameExpire: '3 meses', expireDate: 90}),
            db('expiredate').insert({nameExpire: '12 meses', expireDate: 365}),
        ])
        console.log(newExpireDate)
    }
    catch(error){
        console.log(error)
    }
}