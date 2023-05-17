import User from "../dao/class/user.mongo.js";
import mongoose from "mongoose";
import UserDTO from "../dao/DTO/users.dto.js";
import cartsModel from "../dao/models/carts.model.js";
import { transport } from "../utils.js";
import usersModel from "../dao/models/users.model.js";
import multer from "multer";

const usersService = new User()

export const getUsers = async (req, res)=>{
    if(req.user.user.role == 'admin'){
        const users = await usersService.getUsers()
        const listUser = []
        users.forEach(element=>{
        const user = new UserDTO(element)
        listUser.push(user)
    })
        res.render('user/usersList', {users:listUser})
    }else{
        res.send('Sección solo habilitada para perfil de Administrador')
    }
}


export const deleteUserTime = async(req, res)=>{
    const users = await usersService.getUsers()
    const toDate = new Date()
    let count = 0
    users.forEach(async(element)=>{
        if(element.last_connection){
            if( (toDate.getTime()-element.last_connection.getTime()) > 172800000 && element.role != 'admin' ){
                    try {
                        count++
                        await usersService.deleteUser(element._id)
                        await cartsModel.deleteOne({_id:element.cartId})
                        const result = await transport.sendMail({
                            from:'nicodoffo2015@gmail.com',
                            to: `${element.email}`,
                            subject: 'Tu cuenta ha sido eliminada',
                            html: 
                            ` <div> <h3>
                            Hola ${element.name}, debimos cancelar tu cuenta por falta de actividad. Te esperamos para que vulevas a registrarte.
                            Saludos!
                            </h3>
                            </div>
                            `   
                })
                
                await res.send('Proceso finalizado. Cuentas eliminadas. Mensajes Enviados.')
                    } catch (error) {
                        res.send('EL proceso se interrumpió'+error)
                    }
                    
                
            }
            
        }
        
        
    })
    if (count==0) await res.send('No hay cuenta inactivas')
}

export const userChange = async (req, res)=>{
    const user =  await usersService.getUserById(req.user.user._id)
    res.render('sessions/userChange', {user:user._id})
}

export const userChangeRole = async(req, res)=>{

    const uid = req.params.uid
    const user = await usersService.getUserById(uid)
   
    
    if (user.role == 'premium') {
        user.role = 'user'
        user.documents = []
        user.save()
        return res.send('Ya no eres un usuario premium')
        
    }
    if (user.role == 'user' && user.documents.length!= 0) {
        user.role = 'premium'
        user.save() 
        return res.send('Cambiaste tu rol a PREMIUM!!')
        
    }else{
        return res.send('Tienes pendiente cargar la documentación')
    }
}

//Actualizacion de perfil con input para la carga de archivos con multer

export const dataCharger = async(req, res)=>{
    const userId = req.user.user._id
    res.render('sessions/dataCharger', {userId:userId})
}

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        let folder;
        const type = file.mimetype.split('/')[0]
        switch(type){
            case 'image': 
                folder = 'src/public/uploads/profiles/'
                break
            default:
                folder = 'src/public/uploads/documents/'
        }

        cb(null, folder)

    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }

    
})

export const uploadFiles = async (req, res)=>{
    const imgProfile = req.files['inputFoto'][0]
    if(imgProfile.mimetype.split('/')[0]!= 'image' ) return res.send('Formato inválido corresponde una imagen')
    const ident = req.files['identificacion'][0]
    const domicilio = req.files['domicilio'][0]
    const estadoCta = req.files['estadoCuenta'][0]
    
    
    const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user.user._id)})
    const profile = {
     name: 'Foto de perfil',
     reference: `/uploads/profiles/${imgProfile.filename}`
    }
    const ID = {
     name:'Identificación',
     reference: `/uploads/documents/${ident.filename}`
    }
    const dom = {
      name: 'Domicilio',
      reference: `/uploads/documents/${domicilio.filename}`
    }
    const cuenta = {
      name:'Estado de Cuenta',
      reference: `/uploads/documents/${estadoCta.filename}`
    }
    user.documents = []
    await user.save()
    user.documents.push(profile, ID,dom, cuenta)
    
    await user.save()
    res.redirect('/api/user/change')
     
 }


export const upload = multer({storage:storage})