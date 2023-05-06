import { Router } from "express";
import {getProducts, getProductsById, addProducts, updateProducts, deleteProduct, generateProductService, getImgProduct} from '../controllers/products.controller.js'
import { roleAdmin} from "./sessions.router.js";
import { passportCall } from "../utils.js";


const router = Router()


router.get('/',passportCall('jwt'), roleAdmin, getProducts)

router.get('/:id',passportCall('jwt'), roleAdmin, getProductsById)

router.post('/',passportCall('jwt'), roleAdmin, getImgProduct, addProducts)

router.put('/:id' ,passportCall('jwt'),roleAdmin, updateProducts)

router.delete('/:id',passportCall('jwt'),roleAdmin, deleteProduct)

router.get('/mocks/products', generateProductService)

export default router