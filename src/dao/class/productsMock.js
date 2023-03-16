import { faker } from "@faker-js/faker";

faker.locale = 'es'

export const generateProductMock = ()=>{

   const listProducts = []

    for (let i = 0; i < 100; i++) {
        const product = {
            title:faker.commerce.productName(),
            description : faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(),
            code: faker.random.alphaNumeric(),
            status: faker.datatype.boolean(),
            category: faker.commerce.department() 
        };
        listProducts.push(product)
    }

    return listProducts
}