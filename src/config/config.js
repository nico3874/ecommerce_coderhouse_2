import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--dao <dao>', 'origen de los datos', 'MEMORY')

program.parse() 


const environment = program.opts().dao


dotenv.config({
    path: environment=="MONGO" ? "./.env.mongo" : './.env.memory'
})



export default{
    URI_MONGO : process.env.URI_MONGO,
    persistence : process.env.PERSISTENCE,
    PRIVATE_KEY : process.env.PRIVATE_KEY,
    TYPELOGGER : process.env.TYPELOGGER
}


