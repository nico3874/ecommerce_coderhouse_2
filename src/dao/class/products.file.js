import fs from 'fs'

export default class Products{

    constructor(){
        this.arrayProducts=[]
        this.path = 'src/DB/DB.json';
        
    }

    nextId =  (products)=>{
            
        const count = products.length
        const nextId = (count>0) ? products[count-1].id +1 : 1
        
        return nextId
      }  

    getProducts= async()=>{
       return JSON.parse((await fs.promises.readFile('src/DB/DB.json', "utf-8")))
       
    }

    getProductsById = async(id)=>{
        let product = 'No existe producto'
        const  products =   JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        products.forEach(element => {
           if (id == element.id) product = element 
        });
        return product
    }

    addProducts = async(product)=>{
        const products = await this.getProducts()
        product.id=this.nextId(products)
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products) )
        return product
    }

    updateProduct = async (idQuery, productUpdate)=>{
        const products = await this.getProducts()
        let product =products.find(e=>e.id==idQuery)
        if(product == undefined) return {error:'Prodcuto no existe'} 
        let index = products.indexOf(product)
        products.splice(index, 1)
        productUpdate.id = idQuery
        products.push(productUpdate)
        await fs.promises.writeFile(this.path, JSON.stringify(products) )
        return productUpdate
    }

    deleteProduct = async(id)=>{
        const products = await this.getProducts()
        let product =products.find(e=>e.id==id)
        if(product == undefined) return {error:'Prodcuto no existe'} 
        let index = products.indexOf(product)
        products.splice(index, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(products) )
        return {message:'Producto eliminado correctamente'}
    }
}