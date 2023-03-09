import config from "../config/config.js";
import mongoose from 'mongoose'
import URI_MONGO from '../config/config.js'

export let FactoryProducts;
export let FactoryCart

switch (config.persistence) {
    case 'MONGO':
        mongoose.set('strictQuery', false)

        const mongoConnection = mongoose.connect(URI_MONGO.URI_MONGO, {
            dbName:'ecommerce',
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        
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