
import { FactoryProducts } from "../dao/factory.js";
import { generateProductMock } from "../dao/class/productsMock.js";
import { generateProductsErrorInfo } from "../customErrors/errors/infoError.js";
import { codeError } from "../customErrors/errors/codeErrors.js";
import CustomError from "../customErrors/errors/custom_error.js";
import multer from "multer";
import usersModel from "../dao/models/users.model.js";
import mongoose from "mongoose";
import { transport } from "../utils.js";


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

//Utilización de multer para guardar las imágenes de los productos de los clientes premium en addProducts

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'src/public/uploads/products/')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
    
})

const upload = multer({storage:storage})
export const getImgProduct = upload.single('imgProduct')


export const addProducts = async(req, res, done)=>{
    
    
    const imgProduct = req.file
    const user = await usersModel.findOne({_id: new mongoose.Types.ObjectId(req.user.user._id)})
    
    try {
        
        const {title, description, price, code, stock, category} = req.body

        if(title && description && price && code && stock && category ){
            const product = req.body
            if(req.user.user.role == 'premium'){
                product.owner = req.user.user.email
                if(imgProduct){
                    const imgProductUp = {
                        name : product.title,
                        reference: `uploads/products/${imgProduct.filename}`
                    }
                user.documents.push(imgProductUp)
                }
                
            user.save()
            } 
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
        return res.send('Producto actualizado exitosamente!!')
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
    if (req.user.user.role == 'premium' && product.owner == req.user.user.email){
        const result = await productsService.deleteProduct(idQuery)
        const sensEmail = await transport.sendMail({
            from:'nicodoffo2015@gmail.com',
            to: `${req.user.user.email}`,
            subject: 'Producto eliminado',
            html: 
            ` <div> <h3>
            Hola ${req.user.user.name}, el producto ${product.title} que habías creado, ha sido eliminado.
            Saludos!
            </h3>
            </div>
            `   
    })
    req.logger.info(result)
    return res.send('El producto fue eliminado')
    }
    if (req.user.user.role == 'premium' && product.owner != req.user.user.email){
        res.send('No puedes elimimar un producto que no creaste sino eres administrador')
    }
    
     if (req.user.user.role=='admin') {
        await productsService.deleteProduct(idQuery)
        return res.send('El producto fue eliminado')
     }
    

}

export const generateProductService = async(req, res)=>{
    res.send(generateProductMock())
}
   
        
    
