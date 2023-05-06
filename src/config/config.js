import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--dao <dao>', 'origen de los datos', 'MONGO')

program.parse() 


const environment = program.opts().dao


dotenv.config({
    path: environment=="MEMORY" ? "./.env.memory" : './.env.mongo'
})



export default{
    URI_MONGO : process.env.URI_MONGO,
    persistence : process.env.PERSISTENCE,
    PRIVATE_KEY : process.env.PRIVATE_KEY,
    TYPELOGGER : process.env.TYPELOGGER
}


