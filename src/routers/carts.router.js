import { Router } from "express";
import { cartCreate, getCart, addProductCart, deleteProductCart, deleteAllCart, purchaseCart } from "../controllers/carts.controller.js";
import { passportCall } from "../utils.js";
import { roleUser } from "./sessions.router.js";


const router = Router()

router.get('/:id', getCart)
router.post('/',passportCall('jwt'),roleUser, cartCreate)
router.post('/:cid/products/:pid',passportCall('jwt'),roleUser, addProductCart)
router.delete('/:cid/products/:pid', passportCall('jwt'),roleUser, deleteProductCart)
router.delete('/:cid',passportCall('jwt'), roleUser, deleteAllCart)
router.post('/:cid/purchase',passportCall('jwt'),roleUser, purchaseCart)
export default router