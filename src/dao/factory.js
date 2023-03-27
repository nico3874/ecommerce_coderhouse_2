import config from "../config/config.js";
import mongoose from 'mongoose'
import URI_MONGO from '../config/config.js'
import CustomError from "../customErrors/errors/custom_error.js";
import { generateConectErrorInfo } from "../customErrors/errors/infoError.js";
import { codeError } from "../customErrors/errors/codeErrors.js";


export let FactoryProducts;
export let FactoryCart




switch (config.persistence) {
    
    case 'MONGO':
            mongoose.set('strictQuery', false)
            try {
                await mongoose.connect(URI_MONGO.URI_MONGO, {
                dbName:'ecommerce',
                useNewUrlParser:true,
                useUnifiedTopology:true
                
                })
                
            } catch (error) {
                error = CustomError.createError ({
                    name: "Connection failed",
                    cause: generateConectErrorInfo(),
                    message: "Error al conectar a la base de datos",
                    code: codeError.DATABASE_ERROR
                    
                }) 
            }
            
            
       
          
        
               
        
        
        
        
        const {default:ProductsMongo} = await import('./class/products.mongo.js')
        const {default:CartMongo} = await import('./class/carts.mongo.js')//Importa la clase Products del DAO (se le puede asignar cualquier nombre porque es por default)
        FactoryProducts = ProductsMongo
        FactoryCart = CartMongo
        
        
        break;
    
    case 'MEMORY':
    const {default:ProductsMemory} = await import('./class/products.file.js') 
    FactoryProducts= ProductsMemory

    default: console.log('No hay servicio válido');
        break;
}