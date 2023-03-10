import { FactoryCart } from "../dao/factory.js"
import usersModel from "../dao/models/users.model.js"
import ticketModel from '../dao/models/ticket.model.js'
import mongoose from "mongoose"
const cartsService = new FactoryCart ()


export const cartCreate = async (req, res)=>{
    const newCart = req.body
    const result = await cartsService.createCart(newCart)
    const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(req.user.user._id)})
    
    user.cartId = result
    await user.save()
    console.log('constol'+user)
    res.send(result)

}

export const getCart = async (req, res)=>{
    const id = req.params.id
    const result = await cartsService.getCart(id)
    res.send(result)
}

export const addProductCart = async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cartsService.addProductCart(cid, pid)
    res.redirect('/products')
}

export const deleteProductCart = async(req,res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cartsService.deleteProductCart(cid, pid)
    res.send(result)
}

export const deleteAllCart = async(req, res)=>{
    const cid = req.params.cid
    const result = await cartsService.deleteAllCart(cid)
    res.send(result)
}

export const purchaseCart = async(req,res)=>{
    const cid = req.user.user.cartId
    let amount = 0
    const productList = []
    const cart = await cartsService.purchaseCart(cid)
    cart.products.forEach(element=>{
        const valor =  element.product.price * element.quantity
        amount = amount + valor
        productList.push(element.product.title)
    })

    const ticket = {
        code:cartsService.generateCode(),
        detail: productList,
        purchase_datetime: new Date(Date.now()).toLocaleString(),
        amount:amount,
        purchaser: req.user.user.email

    }

    await ticketModel.create(ticket)
    await cartsService.deleteAllCart(cid)
    res.render('successfulPurchase', {})
    
    
    
}