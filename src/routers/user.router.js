import { Router } from "express";
import { passportCall } from "../utils.js";
import usersModel from "../dao/models/users.model.js";
import mongoose from "mongoose";

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
        user.save() 
        return res.send('Cambiaste tu rol a USER!!')
    }
    if (user.role == 'user') {
        user.role = 'premium'
        user.save() 
        return res.send('Cambiaste tu rol a PREMIUM!!')
    }
})


export default router