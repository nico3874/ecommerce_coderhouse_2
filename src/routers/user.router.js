import { Router } from "express";
import { passportCall } from "../utils.js";
import usersModel from "../dao/models/users.model.js";
import mongoose from "mongoose";
import multer from "multer";

const router = Router()

router.get('/change', passportCall('jwt'), async(req, res) =>{

    const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(req.user.user._id)}).lean().exec()
    res.render('sessions/userChange', {user:user})
})


router.post('/premium/:uid', passportCall('jwt'),  async(req, res)=>{
    const uid = req.params.uid
    const user = await usersModel.findById(uid)
   
    
    if (user.role == 'premium') {
        user.role = 'user'
        user.documents = []
        user.save() 
        return res.send('Cambiaste tu rol a USER!!')
    }
    if (user.role == 'user' && user.documents.length!= 0) {
        user.role = 'premium'
        user.save() 
        return res.send('Cambiaste tu rol a PREMIUM!!')
    }else{
        return res.send('Tienes pendiente cargar la documentación')
    }
})

//Actualizacion de perfil con input para la carga de archivos con multer

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        let folder;
        const type = file.mimetype.split('/')[0]
        switch(type){
            case 'image': 
                folder = 'src/uploads/profiles/'
                break
            default:
                folder = 'src/uploads/documents/'
        }

        cb(null, folder )

    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }

    
})


const upload = multer({storage:storage})


router.get('/datacharger', passportCall('jwt'), async(req, res)=>{
    const userId = req.user.user._id
    res.render('sessions/dataCharger', {userId:userId})
})

router.post('/:uid/documents',passportCall('jwt'),upload.fields([{
    name:'inputFoto', maxCount:1}, 
    {name:'identificacion', maxCount:1},
    {name:'domicilio', maxCount:1},
    {name:'estadoCuenta', maxCount:1},]),
    async (req, res)=>{
   const imgProfile = req.files['inputFoto'][0]
   if(imgProfile.mimetype.split('/')[0]!= 'image' ) return res.send('Formato inválido corresponde una imagen')
   const ident = req.files['identificacion'][0]
   const domicilio = req.files['domicilio'][0]
   const estadoCta = req.files['estadoCuenta'][0]
   
   
   const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user.user._id)})
   const profile = {
    name: 'Foto de perfil',
    reference: `${imgProfile.destination}${imgProfile.filename}`
   }
   const ID = {
    name:'Identificación',
    reference: `${ident.destination}${ident.filename}`
   }
   const dom = {
     name: 'Domicilio',
     reference: `${domicilio.destination}${domicilio.filename}`
   }
   const cuenta = {
     name:'Estado de Cuenta',
     reference: `${estadoCta.destination}${estadoCta.filename}`
   }
   user.documents = []
   user.save()
   user.documents.push(profile, ID,dom, cuenta)
   
   user.save()
   res.send('Datos cargados correctamente, ya puedes cambiarte a Premium!!!')
    
})


export default router