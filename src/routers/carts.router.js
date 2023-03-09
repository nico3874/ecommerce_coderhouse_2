import { Router } from "express";
import { cartCreate, getCart, addProductCart, deleteProductCart, deleteAllCart, purchaseCart } from "../controllers/carts.controller.js";
import { passportCall } from "../utils.js";


const router = Router()

router.get('/:id', getCart)
router.post('/',passportCall('jwt'), cartCreate)
router.post('/:cid/products/:pid', addProductCart)
router.delete('/:cid/products/:pid', deleteProductCart)
router.delete('/:cid', deleteAllCart)
router.get('/purchase/purchase',passportCall('jwt'), purchaseCart)
export default router