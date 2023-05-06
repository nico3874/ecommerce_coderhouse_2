import { Router } from "express";
import mongoose from "mongoose";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";
import { passportCall } from "../utils.js";

import { roleAdmin, roleUser } from "./sessions.router.js";
import usersModel from "../dao/models/users.model.js";
import UserDTO from "../dao/DTO/users.dto.js";



const router = Router()




router.get('/', async (req, res)=>{

    const products = await productsModel.find().lean().exec()
    res.render('home', {products})
    
})

//Mostrar productos con su paginación

router.get('/products',passportCall('jwt'), async(req,res)=>{
    
    const userCart = req.user.user.cartId
    const user = req.user.user
    
    let page = +(req.query.page)
    if (!page) page = 1
    
    
    const products = await productsModel.paginate({}, {page:page, limit:3, lean:true})
    products.docs.forEach(element => {
        element.cartId = userCart
    });
    
    //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
    products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
    products.isValid = !(page <=0 || page > products.totalPages)
    products.userName = user.name
    products.userId = user._id
    products.cartId = user.cartId
    
    res.render('products', products)
    

})

router.get('/github/products', async(req,res)=>{
    
    let page = +(req.query.page)
    if (!page) page = 1
    
    
    const products = await productsModel.paginate({}, {page:page, limit:3, lean:true})
    
    
    //Aquí creo los enlaces que me van a servir para utilizar en la vista y mover las páginas esto va en una etiqueta <a src="prevLink">
    products.prevLink = products.hasPrevPage ? `/products?page=${products.PrevPage}`: '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}`: '';
    products.isValid = !(page <=0 || page > products.totalPages)
   
    
    res.render('products', products)
    

})

router.get('/admin', passportCall('jwt'), roleAdmin, async(req, res)=>{
    (req.user.user.role == 'admin')? res.render('products/adminProduct'): res.send('No tienes permiso para ingresar a esta sección')
    
    
})

router.get('/updateProduct', passportCall('jwt'), roleAdmin, async(req, res)=>{
    req.user.user.role == 'admin' ? res.render('products/update'): res.send('No tienes permiso para ingresar a esta sección')
    
})



router.post('/updateProduct', async(req, res)=>{
    const pid = req.body.id
    
    const product = await productsModel.findOne({_id:new mongoose.Types.ObjectId(pid)}).lean().exec()
    res.render('products/update', {product:product})

})

router.get('/deleteProduct', passportCall('jwt'), roleAdmin, async(req, res)=>{
    req.user.user.role == 'admin'? res.render('products/delete'): res.send('No tienes permiso para ingresar a esta sección')
    
})

router.post('/deleteProduct', async(req, res)=>{
    const pid = req.body.id
    
    const product = await productsModel.findOne({_id:new mongoose.Types.ObjectId(pid)}).lean().exec()
    res.render('products/delete', {product:product})

})


//Mostramos un producto específico 

router.get('/products/:pid',passportCall('jwt'), async(req, res)=>{
    
   
    const cid = req.user.user.cartId
    
    const productParam = req.params.pid
    const product = await productsModel.findOne({_id:new mongoose.Types.ObjectId(productParam)}).lean().exec()
    res.render('productDetail', {product:product, cid:cid})

})



router.get('/realtimeproducts',passportCall('jwt'), (req, res)=>{
    
        res.render('realTimeProducts')
    
    
})

//Chat

router.get('/chat',passportCall('jwt'),roleUser, (req, res)=>{
    
    res.render('chat', {})


})

//Ver carrito completo

router.get('/cart/:cid',passportCall('jwt'), async(req, res)=>{
    const cartParam = req.user.user.cartId[0]
    const cart = await cartsModel.find({_id:new mongoose.Types.ObjectId(cartParam)}).lean() //Utilizar lean() para que handlebars reciba un objeto tipo json
    res.render('cartsDetail', {productsCart:cart[0].products,quantity:cart[0].products.quantity, cart:cartParam })

})

router.get('/productCreate', (req, res)=>{
    res.render('products/create', {})
})

//Manejo de Usuarios desde el administrador

router.get('/admin/getuser',passportCall('jwt'), async(req, res)=>{
    
    res.render('user/userDetail')
})

router.post('/userview', passportCall('jwt'), roleAdmin, async(req, res)=>{
    const id = req.body.id
    if (mongoose.Types.ObjectId.isValid(id)){
            const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(id)}).lean().exec()
            !user ? res.send('Usuario no existe'): res.render('user/userDetail', {user:new UserDTO(user), id:id})
        }else{
             res.send('El formato de iD inválido')
        }
    

    
})

router.put('/changerole', passportCall('jwt'), roleAdmin, async(req, res)=>{
    const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(req.body.id)})
    user.role = req.body.role
    user.save()
    res.send('Formulario Procesado')
    
})

router.delete('/deleteuser', passportCall('jwt'), roleAdmin, async(req, res)=>{
     const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.body.id)})       
     await usersModel.deleteOne(user)
     await cartsModel.deleteOne({_id: new mongoose.Types.ObjectId(user.cartId[0])})
     res.send('Formulario procesado')
})


export default router