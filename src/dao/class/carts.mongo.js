import cartsModel from "../models/carts.model.js";
import mongoose from "mongoose";

export default class Cart{

    constructor(){}

    createCart = async (newCart)=> {
        try {
            const result=await cartsModel.create(newCart)
            return result
        } catch (error) {
            return error
        }
         

    }

    getCart = async(id)=>{
        try {
            const cart = await cartsModel.findOne({_id:new mongoose.Types.ObjectId(id)})
            return {status:'Success', message: `Carrito encontrado`, cart}
        } catch (error) {
            error = 'Carrito no existe'
            return  error
        }
    }

    addProductCart = async(cid, pid, quantity)=>{
        const cart = await cartsModel.findOne({_id:new mongoose.Types.ObjectId(cid)})
        cart.products.forEach(element=>{
            if (element.product ==pid){
                
                let index = cart.products.findIndex(i =>i.product==element.product )
                
                cart.products.splice(index, 1)
            }
        })
        cart.products.push({product:pid, quantity:quantity})
        cart.save()
        return cart
        
        
    }

    deleteProductCart = async(cid, pid)=>{
        const cart = await cartsModel.findOne({_id:new mongoose.Types.ObjectId(cid)})
        const ItemRemove = cart.products.find(p=>p.product._id==pid)
        if(ItemRemove){
            
            cart.products.pull(ItemRemove)
            await cart.save() 
            return({message:'Producto eliminado '})
        }else{
            return {error:'No se pudo procesar la petición'}
        }
        }
    deleteAllCart = async(cid)=>{
        const cart = await cartsModel.findOne({_id:new mongoose.Types.ObjectId(cid)})
        cart.products=[]
        await cart.save()
        return {message:'Carrito vacío'}
    }

    generateCode = ()=>{
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (var i = 0; i < 6; i++) {
          var randomIndex = Math.floor(Math.random() * characters.length);
          code += characters.charAt(randomIndex);
        }
        return code;
      }
    

    purchaseCart = async(cid)=>{
        const cart = await cartsModel.find({_id:new mongoose.Types.ObjectId(cid)})
        return cart[0]
    }
}