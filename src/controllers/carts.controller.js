import { FactoryCart, FactoryProducts} from "../dao/factory.js"
import usersModel from "../dao/models/users.model.js"
import ticketModel from '../dao/models/ticket.model.js'
import mongoose from "mongoose"
import productsModel from "../dao/models/products.model.js"

const cartsService = new FactoryCart ()
const productsService = new FactoryProducts()


export const cartCreate = async (req, res)=>{
    const newCart = req.body
    const result = await cartsService.createCart(newCart)
    const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(req.user.user._id)})
    
    user.cartId = result
    await user.save()
    
    res.send(result)

}

export const getCart = async (req, res)=>{
    const id = req.params.id
    const result = await cartsService.getCart(id)
    req.logger.info(result)
    res.send(result)
}

export const addProductCart = async(req, res)=>{
    
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity
    const product = await productsService.getProductsById(pid)
    if(req.user.user.email == product.owner) return res.send({error:'No puedes comprar un prodcuto que tu creaste'})
    const result = await cartsService.addProductCart(cid, pid, quantity)
    req.logger.debug(result)
    res.redirect('/products')
}

export const deleteProductCart = async(req,res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cartsService.deleteProductCart(cid, pid)
    req.logger.info(result)
    res.send(result)
}

export const deleteAllCart = async(req, res)=>{
    const cid = req.params.cid
    const result = await cartsService.deleteAllCart(cid)
    req.logger.info(result)
    res.send(result)
}

export const purchaseCart = async(req,res)=>{
    try {
        const cid = req.user.user.cartId[0]
        let amount = 0
        const productList = []
        const cart = await cartsService.purchaseCart(cid)
    
    cart.products.forEach(async(element)=>{
        if(element.product.stock>= element.quantity){
        
        const valor =  element.product.price * element.quantity
        amount = amount + valor
        productList.push(element.product.title)
        let product = await productsModel.findOne({_id: new mongoose.Types.ObjectId(element.product)})
        product.stock = product.stock - element.quantity
        product.save()
        }
        
    
        
    })

    const ticket = {
        code:cartsService.generateCode(),
        detail: productList,
        purchase_datetime: new Date(Date.now()).toLocaleString(),
        amount: amount,
        purchaser: req.user.user.email

    }

    const newTicket=  await ticketModel.create(ticket)
    await cartsService.deleteAllCart(cid)
    res.render('successfulPurchase', newTicket)
    req.logger.info(`${newTicket} creado con exito`)
    } catch (error) {
        req.logger.warning('La compra no pudo finalizarse')
    }
    
    
    
    
}

export const getTicketUser = async(req, res)=>{
    const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user.user._id)})
    const tickets = await ticketModel.find().lean()
    const userTickets = []
    let context =true
    
    tickets.forEach(element => {
        element.purchaser == user.email && userTickets.push(element)
    });
    if(userTickets.length ==0) context = false
    res.render('userTicket', {userTickets:userTickets, context:context})
}