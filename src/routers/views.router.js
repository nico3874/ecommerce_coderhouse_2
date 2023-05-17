import { Router } from "express";
import mongoose from "mongoose";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";
import { passportCall } from "../utils.js";

import { roleAdmin, roleUser } from "./sessions.router.js";
import usersModel from "../dao/models/users.model.js";
import UserDTO from "../dao/DTO/users.dto.js";



const router = Router()
const ObjID = mongoose.Types.ObjectId


router.get('/', async (req, res)=>{
    
    
    const products = await productsModel.find().lean().exec()
    if (req.user){
        const user = req.user.user
        const dataSend = {products, user}
        res.render('home', dataSend)
    }else{
        res.render('home', {products})
    }
    
    
})

//Mostrar productos con su paginación

router.get('/products',passportCall('jwt'), async(req,res)=>{
    
    const userCart = req.user.user.cartId
    const user = req.user.user
    
    let page = +(req.query.page)
    if (!page) page = 1
    
    
    const products = await productsModel.paginate({}, {page:page, limit:6, lean:true})
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
    products.userType = user.role
    if (user.role == 'admin') products.userRole = user.role
    if (user.role == 'premium') products.userRole = user.role
    
    
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
     res.render('products/adminProduct')
    
    
})

router.get('/updateProduct', passportCall('jwt'), roleAdmin, async(req, res)=>{
     res.render('products/update')
    
})



router.post('/updateProduct', async(req, res)=>{
    const pid = req.body.id
    if (!ObjID.isValid(pid)) return res.send('Formato de ID inválido o el campo está vacío')
    
    const product = await productsModel.findOne({_id:new mongoose.Types.ObjectId(pid)}).lean().exec()
    res.render('products/update', {product:product})

})

router.get('/deleteProduct', passportCall('jwt'), roleAdmin, async(req, res)=>{
    res.render('products/delete')
    
})

router.post('/deleteProduct', async(req, res)=>{
    const pid = req.body.id
    if (!ObjID.isValid(pid)) return res.send('Formato de ID inválido o el campo está vacío')
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
    let context = true
    let total = 0
    cart[0].products.forEach(element => {
        let suma = element.product.price*element.quantity
        total = total+suma
    });
    if(cart[0].products.length==0) context = false
    res.render('cartsDetail', {productsCart:cart[0].products,quantity:cart[0].products.quantity, cart:cartParam, context:context, total:total })

})

router.get('/productCreate', (req, res)=>{
    res.render('products/create', {})
})

//Manejo de Usuarios desde el administrador

router.get('/admin/getuser',passportCall('jwt'), async(req, res)=>{
    
   req.user.user.role == 'admin' ? res.render('user/userDetail') : res.send('No tienes premiso para acceder a esta sección')
})

router.post('/userview', passportCall('jwt'), roleAdmin, async(req, res)=>{
    const id = req.body.id
    if (mongoose.Types.ObjectId.isValid(id)){
            const user = await usersModel.findOne({_id:new mongoose.Types.ObjectId(id)}).lean().exec()
            !user ? res.send('Usuario no existe'): res.render('user/userDetail', {user:new UserDTO(user), id:id})
        }else{
             res.send('El formato de ID es inválido')
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