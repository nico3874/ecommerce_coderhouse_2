import passport from 'passport'
import local from 'passport-local'
import usersModel from '../dao/models/users.model.js'
import { isValidPassword, createHash, cookieExtractor } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import  PRIVATE_KEY  from './config.js'
import { generateToken } from '../utils.js'
import CustomError from '../customErrors/errors/custom_error.js'
import { generateUserErrorInfo } from '../customErrors/errors/infoError.js'
import { codeError } from '../customErrors/errors/codeErrors.js'

// Registro y Login con estrategia local

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy



const initPass = ()=>{

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
},
async(req, username, password, done)=>{
    
    try {
        const {name, lastName, email, age,cartId} = req.body
        
        if (name && lastName && email && age){
            const user = await usersModel.findOne({email:username})
            if(user){
                req.logger.warning('Usuario ya existe')
                return done(null, false)}

            const newUser = {
                name,
                lastName,
                email,
                age,
                password: createHash(password)
            }
            if(req.body.premium) newUser.role = 'premium'
            const result = await usersModel.create(newUser)
            return (done(null, result))
        
        }
        
    
        error=   CustomError.createError ({
            name: "User creation error",
            cause: generateUserErrorInfo({name, lastName, email, age}),
            message: "Error trying to create user",
            code: codeError.INVALID_TYPES_ERROR
            
        }) 
        
    } catch (error) {
        return done(error)
    }
}))

    //Login Local
    passport.use('login', new LocalStrategy(
        {usernameField:'email'},
        async (username, password, done)=>{
            
            try {
                const user = await usersModel.findOne({email:username})
                
                if(!user){
                    console.error('Usuario no existe')
                    return done (null, false)
                }
                if(!isValidPassword(user, password)) return done(null, false)
                
                const acces_token = generateToken(user)
                user.token = acces_token
                
                

                return done(null, user)
                
            } catch (error) {
                return done(error)
            }
        
        }
    ))


      //Estrategia con github

      passport.use('github',new GitHubStrategy({
        clientID: 'Iv1.9bb66ce1019d5229',
        clientSecret: '4c3bb4f9854ae64b1535c7311c92441e670b7c72',
        callBackURL: 'http://localhost:8080/sessions/githubcallback'

    },
    
    //Configuración de la función para registrar con github
    async (accesToken, refreshToken, profile, done)=>{
        

        try {
            const user = await usersModel.findOne({email:profile._json.email})
            if(user){
                console.log('User already exits')
                return done(null, user)
            }

            const newUser = {
                name: profile.username,
                lastName:'',
                email: profile._json.email,
                password :''
            }

            const result = await usersModel.create(newUser)
            return done (null, user)
        } catch (error) {
            return done('Error to login with github' + error)
        }
    }

    ))

    //JWT Strategy

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY.PRIVATE_KEY

    }, async (jwt_payload, done)=>{
        try {
            
            return done (null, jwt_payload)
        } catch (error) {
            return done (error)
        }
    }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done)=>{
        const user = await usersModel.findById(id)
        done(null, user)
    })
}

export default initPass