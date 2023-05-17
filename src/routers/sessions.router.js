import { Router } from "express";
import passport from "passport";
import mongoose from "mongoose";
import cartsModel from "../dao/models/carts.model.js";
import usersModel from "../dao/models/users.model.js";
import { createHash } from "../utils.js";
import { compareSync } from "bcrypt";
import { transport } from "../utils.js";






const router = Router()

//Middleware de autenticación
export function roleAdmin (req, res, next){
    
    if(req.user.user.role ==='admin' || req.user.user.role === 'premium') return next()
    res.send({error:'Credenciales Inválidas'})

    /* res.send('Su perfil no le permite acceder')  */
    /* Encadenar metodos send, render, etc en cadenas de validación de middleware puede generer el error Cannot set headers after they are sent to the client */
}

export function roleUser (req, res, next){
    
    if(req.user.user.role =='user' || req.user.user.role == 'premium') return next()
    
    
}

export function tokenActive  (req, res, next){
    !req.cookies.userToken? next(): res.send('Ya existe una sesión, debes salir para poder registrar un nuevo usuario y/o realizar el login')
   
}

export function auth(req, res, next){
    if(req.session?.user) return next()
    
    return res.status(401).render('sessions/sessionsError', {error: 'Problemas con la autentificación'})
}

//Esto crea al usuasrio en Mongo sin passport

router.get('/register', (req, res)=>{
    
    
    res.render('sessions/register', {})
})


//Estrategia local con passport

router.post('/create',tokenActive, passport.authenticate('register', {failureRedirect:'/sessions/failedRegister'}), async(req, res)=>{
    
        const userCart = await cartsModel.create(req.body)
        const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
        user.cartId = userCart
        user.save()
        res.redirect('/sessions/login')
   

    
})

//Respuesta de falla de registro

router.get('/failedRegister', (req, res)=>{
    res.status(401).send({error:'Failed register'})
})

//Esto permite el login, ahora trabajo con sesiones sin passport

router.get('/login', (req, res)=>{
    
    res.render('sessions/login', {})
})




//Login con passport y estrategia local

router.post('/login',tokenActive, passport.authenticate('login', {failureRedirect:'/sessions/failedLogin'}),async (req, res)=>{
const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
user.last_connection = new Date()
user.save()
res.cookie('userToken', req.user.token).redirect('/products')

})

//Respuesta al error de Login 

router.get('/failedLogin', (req, res)=>{
    if(!req.user) return res.status(400).send('Invalid Credentials')
    res.render('sessions/sessionsError', {error:'Error en el login verifica usuario y contraseña'})
})

//Con Github

router.get('/login-github', passport.authenticate('github', {scope: ['user:email']}), (req, res)=>{}) //Scope se usa para ver los alcances del token del usuario

//Ahora configuramos una vez que git nos permite o niega el acceso

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/sessions/login'}), (req, res)=>{
    
    req.session.user = req.user
    res.redirect('/github/products')
})


router.get('/logout', (req, res)=>{
    
    
    req.session.destroy(err=>{console.log(err)})
    res.clearCookie('userToken').redirect('/sessions/login')
})


//Recuperar Password


router.get('/recoverPassForm', async(req, res)=>{
    
    res.render('sessions/recoverPassForm', )
})

router.post('/emailSend', async(req, res)=>{
    const {user} = req.body
    const time = Date.now()

    const result = await transport.sendMail({
        from:'nicodoffo2015@gmail.com',
        to: `${user}`,
        subject: 'Reestablece tu contraseña',
        html: 
           ` <div> <form action="https://ecommercecoderhouse2-production.up.railway.app/sessions/emailRecover" method="post">
           <input type="hidden" value=${user} name="user">
           <input type="hidden" value=${time} name="time">
           <input type="submit" value="Reestablecer">
       
       </form>
        </div>
           `
    })
    return res.send('Enlace enviado, revisa tu correo...')
})

router.post('/emailRecover', async(req, res)=>{
    
    const {user, time} = req.body
    if((Date.now()-time)>3600000) return res.render('sessions/expiredLink');
    
    res.render('sessions/newPass', {user:user})
})

router.post('/recoverPass/:user', async(req, res)=>{

    const user = req.params.user
    const {newPass, time} = req.body
    
    const userFind =  await usersModel.findOne({email:user})
    if (compareSync(newPass, userFind.password))return res.send('No se puede ponner la misma password')
    userFind.password = createHash(newPass)
    userFind.save()
    res.send('Password reestablecisa.')

})





export default router 
