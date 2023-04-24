
import mongoose from "mongoose";
import  assert  from "assert";
import Products from "../src/dao/class/products.mongo.js";


describe('Testing Products DAO', ()=>{
    before(function(){
            mongoose.connect('mongodb+srv://nik3874:dHuhHFsdwNUGN4rD@cluster0.37pyhxm.mongodb.net/?retryWrites=true&w=majority', {
            dbName:'ecommerce',
            useNewUrlParser:true,
            useUnifiedTopology:true
            
            })
    })

    

    it('Debemos obtener todos los productos', async()=>{
            const products = new Products()
            const result = await products.getProducts()
            assert.strictEqual(Array.isArray(result), true)
        
        
    }).timeout(10000)

    it('DEbemos crear un producto', async()=>{
        const products = new Products()
        const product = {
            title: 'borrar',
            price: 50
        }
       const result = await products.addProducts(product) 
       assert.ok(result._id)
    })

    it('Debemos obtener el producto por su ID', async()=>{
        const products = new Products()
        const result = await products.getProductsById('63c84a4e1921bf88d06df923')
        assert.strictEqual(typeof result, 'object')
        console.log(result);
    })
})


