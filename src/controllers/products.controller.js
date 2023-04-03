
import { FactoryProducts } from "../dao/factory.js";
import { generateProductMock } from "../dao/class/productsMock.js";

import { generateProductsErrorInfo } from "../customErrors/errors/infoError.js";
import { codeError } from "../customErrors/errors/codeErrors.js";
import CustomError from "../customErrors/errors/custom_error.js";


const productsService = new FactoryProducts()


export const getProducts = async(req, res)=>{
    const result = await productsService.getProducts()
    if(!result) return res.status(500).send({status:error, error:'No hay productos'})
    return res.status(200).send({status:'success', payload:result})
}

export const getProductsById = async(req, res)=>{
    const idQuery = req.params.id
    const product = await productsService.getProductsById(idQuery)
    return res.status(200).send(product)
        
}


export const addProducts = async(req, res, done)=>{
    
    try {
        
        const {title, description, price, code, stock, category} = req.body

        if(title && description && price && code && stock && category ){
            const product = req.body
            if(req.user.user.role == 'premium') product.owner = req.user.user.email
            const newProduct = await productsService.addProducts(product)
            return res.status(200).send({status:'succes', mesage:'Producto cargado correctamente', payload:newProduct})      
       
    }

    error = CustomError.createError ({
        name: "Product creation error",
        cause: generateProductsErrorInfo({title, description, price, code, stock, category}),
        message: "Error trying to create Product",
        code: codeError.INVALID_TYPES_ERROR
        
    }) 
    } catch (error) {
        return done(error)
    }
        
        
    }
    
    

export const updateProducts = async ( req, res, done)=>{

    try {
        const {title, description, price, code, stock, category} = req.body
        if(title && description && price && code && stock && category ){
        const idQuery = req.params.id
        const productUpdate = req.body
        const result = await productsService.updateProduct(idQuery, productUpdate)
        req.logger.info(result)
        return res.send(result)
    }
    error = CustomError.createError ({
        name: "Product update error",
        cause: generateProductsErrorInfo({title, description, price, code, stock, category}),
        message: "Error trying to update Product",
        code: codeError.INVALID_TYPES_ERROR})

        
    } catch (error) {
        return done(error)
    }
    
    
        
    }


export const deleteProduct = async (req, res)=>{
    const idQuery = req.params.id
    const product = await productsService.getProductsById(idQuery)
    if (req.user.user.role == 'premium' && product.owner == req.user.user.email ||req.user.user.role == 'admin'){
    const result = await productsService.deleteProduct(idQuery)
    console.log('Producto eliminado!!');
    req.logger.info(result)
    return res.send(result)}
    else{
        console.log('No puedes elimimar un producto que no creaste sino eres administrador');
        res.send('No puedes elimimar un producto que no creaste sino eres administrador')
    }

}

export const generateProductService = async(req, res)=>{
    res.send(generateProductMock())
}
   
        
    
