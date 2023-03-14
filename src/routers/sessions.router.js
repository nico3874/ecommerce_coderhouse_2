import { Router } from "express";
import passport from "passport";
import mongoose from "mongoose";
import cartsModel from "../dao/models/carts.model.js";
import usersModel from "../dao/models/users.model.js";




const router = Router()

//Middleware de autenticación
export function roleAdmin (req, res, next){
    
    if(req.user.user.role ==='admin') next()
    /* res.send('Su perfil no le permite acceder')  */
    /* Encadenar metodos send, render, etc en cadenas de validación de middleware puede generer el error Cannot set headers after they are sent to the client */
}

export function roleUser (req, res, next){
    
    if(req.user.user.role =='user') return next()
    
    /* res.send('Su perfil no le permite acceder') */
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

router.post('/create', passport.authenticate('register', {failureRedirect:'/sessions/failedRegister'}), async(req, res)=>{
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

/


//Login con passport y estrategia local

router.post('/login', passport.authenticate('login', {failureRedirect:'/sessions/failedLogin'}),async (req, res)=>{


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



export default router 
