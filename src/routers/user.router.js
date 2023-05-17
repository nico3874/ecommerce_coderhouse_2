import { Router } from "express";
import { passportCall } from "../utils.js";
import { roleAdmin } from "./sessions.router.js";
import { getUsers, deleteUserTime, userChange, userChangeRole, dataCharger, uploadFiles, upload } from "../controllers/users.controller.js";


const router = Router()

router.get('/', passportCall('jwt'), roleAdmin, getUsers) 

router.delete('/', passportCall('jwt'), roleAdmin, deleteUserTime)

router.get('/change', passportCall('jwt'), userChange) 

router.post('/premium/:uid', passportCall('jwt'), userChangeRole) 

router.get('/datacharger', passportCall('jwt'), dataCharger)

router.post('/:uid/documents',passportCall('jwt'),upload.fields([{
    name:'inputFoto', maxCount:1}, 
    {name:'identificacion', maxCount:1},
    {name:'domicilio', maxCount:1},
    {name:'estadoCuenta', maxCount:1},]),
   uploadFiles)


export default router