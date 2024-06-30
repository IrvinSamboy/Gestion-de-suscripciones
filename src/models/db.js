import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const MYSQLHOST= process.env.MYSQLHOST
const MYSQLPORT = process.env.MYSQLPORT
const MYSQLUSER = process.env.MYSQLUSER
const MYSQLPASSWORD= process.env.MYSQLPASSWORD
const MYSQLDATABASE = process.env.MYSQLDATABASE

const db = knex({
    client: 'mysql',
    connection: {
        host: MYSQLHOST,
        port: MYSQLPORT,
        user: MYSQLUSER,
        password: MYSQLPASSWORD,
        database: MYSQLDATABASE
    }
})

export const connectionSuccessfully = async () =>{
    try{
        await db.raw('SELECT 1')
        console.log("successful connection")
    }
    catch(error){
        console.log(error)
    }
}

export default db