
import { FactoryProducts } from "../dao/factory.js";
import { passportCall } from "../utils.js";


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


export const addProducts = async(req, res)=>{

    const product = req.body
    
    const newProduct = await productsService.addProducts(product)
    return res.status(200).send({status:'succes', mesage:'Producto cargado correctamente', payload:newProduct})
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
   
        
    
