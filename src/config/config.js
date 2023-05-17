import dotenv, { config } from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--dao <dao>', 'origen de los datos', 'MONGO')

program.parse() 


const environment = program.opts().dao


dotenv.config({
    path: environment=="MEMORY" ? "./memory.env" : './mongo.env'
})


export const URI_MONGO = process.env.URI_MONGO
export const persistence = process.env.PERSISTENCE
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const TYPELOGGER = process.env.TYPELOGGER
export const USEREMAIL = process.env.USEREMAIL
export const PASSEMAIL = process.env.PASSEMAIL

export default config

