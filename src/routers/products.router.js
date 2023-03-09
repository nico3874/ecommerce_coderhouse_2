import { Router } from "express";
import {getProducts, getProductsById, addProducts, updateProducts, deleteProduct} from '../controllers/products.controller.js'
import { roleAdmin, roleUser } from "./sessions.router.js";
import { passportCall } from "../utils.js";
const router = Router()


router.get('/',passportCall('jwt'), roleAdmin, getProducts)

router.get('/:id',passportCall('jwt'), roleAdmin, getProductsById)

router.post('/',passportCall('jwt'),roleAdmin, addProducts)

router.put('/:id' ,passportCall('jwt'),roleAdmin, updateProducts)

router.delete('/:id',passportCall('jwt'),roleAdmin, deleteProduct)



export default router