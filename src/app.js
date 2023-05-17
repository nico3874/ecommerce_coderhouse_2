import express from 'express'
import productsRouter from './routers/products.router.js'
import cartsRouter from   './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import sessionsRouter from './routers/sessions.router.js'
import loggerRouter from './routers/logger.router.js'
import userRouter from './routers/user.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import fs from 'fs'
import { Server as serverHtttp } from 'http'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import initPass from './config/passport.config.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import {URI_MONGO, PORT} from './config/config.js'
import chatModel from './dao/models/chat.model.js'
import errorHandler from './middlewares/errors/middlewareError.js'
import { addLogger } from './utils.js'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'



const app = express()
app.use(addLogger)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())


app.use(express.static(__dirname + '/public'))

app.use(session({
    store:MongoStore.create({
        mongoUrl: URI_MONGO,
        dbName: 'ecommerceSessions',
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology:true
        },
        ttl:120,
        
    }), 
    resave:true,
    secret: 'registeruser',
    saveUninitialized:true

    
}))



initPass()
app.use(passport.initialize())
app.use(passport.session())


//Configuración Documentación con Swagger 

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación Ecommerce Coder",
            description: "Documentación del código del Ecommerce desarrolada en el curso de Backend en CoderHouse"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



app.use((req, res, next)=> {
    res.locals.userLoger = false
    if (req.cookies.userToken) res.locals.userLoger = true
    next();
  });

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
//Middleware de navbar


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/sessions', sessionsRouter)
app.use('/logger', loggerRouter)
app.use('/api/user', userRouter)

app.use(errorHandler)



const httpServer = new serverHtttp(app)
const io = new Server(httpServer)



const server = httpServer.listen(PORT, ()=>{console.log("Running server...")})
server.on('error', (error)=>{
    console.log(error)
})




//Chat con socket.io

io.on('connection', async (socket) =>{
    const data = await fs.promises.readFile( 'src/DB/DB.json', "utf-8")
    const listProducts = JSON.parse(data)
    
    console.log( `New client connected, id:${socket.id}`)
    
    io.sockets.emit('productos', listProducts)
   
})



//Chat desde el lado del servidor

let messages = []


io.on ('connection', socket =>{
    console.log('New client connected');

    socket.on('authenticated', async(data) =>{
        io.emit('newLogin', data)
        
        await chatModel.create({user:data, message:[]})
    })

    socket.on('message',async (data)=>{
        
        messages.push(data)
        
        await chatModel.updateOne({user:data.user}, {$set:{message:messages}})

        io.emit('messageLogs', messages)
    })

    
    
})













