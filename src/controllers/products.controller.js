
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
            const product = {title, description, price, code, stock, category}
            const newProduct = await productsService.addProducts(product)
            return res.status(200).send({status:'succes', mesage:'Producto cargado correctamente', payload:newProduct})      
       
    }

    error = CustomError.createError ({
        name: "User creation error",
        cause: generateProductsErrorInfo({title, description, price, code, stock, category}),
        message: "Error trying to create user",
        code: codeError.INVALID_TYPES_ERROR
        
    }) 
    } catch (error) {
        return done(error)
    }
        
        
    }
    
    
    
   

    


export const updateProducts = async ( req, res)=>{

    const idQuery = req.params.id
    const productUpdate = req.body
    const result = await productsService.updateProduct(idQuery, productUpdate)
    console.log(result)
    return res.send(result)
        
    }


export const deleteProduct = async (req, res)=>{
    const idQuery = req.params.id
    const result = await productsService.deleteProduct(idQuery)
    return res.send(result)

}

export const generateProductService = async(req, res)=>{
    res.send(generateProductMock())
}
   
        
    
