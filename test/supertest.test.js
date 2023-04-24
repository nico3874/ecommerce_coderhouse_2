import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";


const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')



describe('Test para router Products', ()=>{
    let idGenerate;
    let cookie;
    before(async function(){
        const userLog = {
            email: 'test@test',
            password: '1234'
        }
        const logger = await requester.post('/sessions/login').send(userLog)
        cookie = logger.headers['set-cookie'][0]
    })
    describe('Read Products', ()=>{

        
        it('Devolución de todos los productos get api/products', async()=>{
           
            const response = await requester.get('/api/products').set('Cookie', cookie)
            expect(response.status).to.be.deep.equal(200)
            
            
        })
    })

    describe('Read Products by ID', ()=>{

        
        it('Devolución de un producto en en base a su id get api/products/:id', async()=>{
           
            const response = await requester.get('/api/products/63c84b701921bf88d06df92a').set('Cookie', cookie)
            expect(response._body).to.have.property('_id')
            
            
        })
    })

    describe('Product Create', ()=>{

        
        it('Crear un nuevo producto', async()=>{
            const newProduct = {
                title: 'test',
                description: 'jfhdjfj',
                price: 30,
                code: 'asd890',
                stock:10,
                category:'borrar'
            }
            const response = await requester.post('/api/products').set('Cookie', cookie).send(newProduct)
            
            expect(response._body.payload).to.have.property('_id')
            idGenerate = response._body.payload._id
            
        })
    })

    describe('Product Update', ()=>{

        
        it('Actualizar un producto', async()=>{
            const newProduct = {
                _id:idGenerate,
                title: 'test',
                description: 'jfhdjfj',
                price: 50,
                code: 'asd890',
                stock:10,
                status: true,
                category:'borrar',
                owner: 'admin'
            }
            const response = await requester.put(`/api/products/${idGenerate}`).set('Cookie', cookie).send(newProduct)
            expect(response._body.productUpdate).to.be.deep.equals(newProduct)
            
            
            
        })
    })

    describe('Product Delete', ()=>{

        
        it('Borrar un producto', async()=>{
           
            const response = await requester.delete(`/api/products/${idGenerate}`).set('Cookie', cookie)
            expect(response._body.status).to.be.deep.equals('Success')
            
            
        })
    })
})

// Test para Cart

describe('Test para router Carts', ()=>{
    let idProduct = '641e30853cca493a6d5ac6aa' ;
    let cookie;
    before(async function(){
        const userLog = {
            email: 'foto-videovision@hotmail.com',
            password: '1234'
        }
        const logger = await requester.post('/sessions/login').send(userLog)
        cookie = logger.headers['set-cookie'][0]
    })
    describe('Get Cart ', ()=>{

        
        it('Devolución del carrito de acuerdo al id en el parámetro', async()=>{
           
            const response = await requester.get('/api/carts/642a2d4c3941205eb3140ebf').set('Cookie', cookie)
            console.log(response._body);
            expect(response.status).to.be.deep.equal(200)
            
            
        })
    })

    describe('Add Product ', ()=>{

        
        it('Agregar un producto a un carrito determinado', async()=>{
           
            const response = await requester.post(`/api/carts/642a2d4c3941205eb3140ebf/products/${idProduct}`).set('Cookie', cookie).send({quantity:4})
            
            expect(response.status).to.be.deep.equal(302)
            
            
        })
    })

    describe('Delete Product ', ()=>{

        
        it('Eliminar un producto de un carrito determinado', async()=>{
           
            const response = await requester.delete(`/api/carts/642a2d4c3941205eb3140ebf/products/${idProduct}`).set('Cookie', cookie)
            
            expect(response.status).to.be.deep.equal(200)
            
            
        })
    })
    

})