import productsModel from "../models/products.model.js";
import mongoose from "mongoose";


export default class Products{

    constructor(){}

    getProducts= async()=>{
       return await productsModel.find()
       
    }

    getProductsById = async(id)=>{
        try {
            return await productsModel.findOne({_id: new mongoose.Types.ObjectId(id)})//Hay que conectar con user
        } catch (error) {
            return {error:'No existe producto'}
        }
        
        
    }

    addProducts = async(product)=>{
        return await productsModel.create(product)
    }

    updateProduct = async (idQuery, productUpdate)=>{
        try {
            await productsModel.updateOne({_id: new mongoose.Types.ObjectId(idQuery)}, productUpdate)
            return {status:200, message:'Success', productUpdate}
        } catch (error) {
            return {error:'No existe producto'}
        }
        
    }

    deleteProduct = async(id)=>{
        try {
            await productsModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})
            return {status:'Success', message:'Producto eliminado'}
        } catch (error) {
            return {error:'No existe producto'}
        } 
        
    }
}


