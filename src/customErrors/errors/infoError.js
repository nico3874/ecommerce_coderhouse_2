export const generateUserErrorInfo = user => {
    return `Uno o mas propiedades estan incompletos o son invalidos.
    Lista de propiedades obligatorios:
        * first_name: Necesita ser un string, recibio ${user.first_name}
        * last_name: Necesita ser un string, recibio ${user.last_name}
        * email: Necesita ser un string, recibio ${user.email}
        * password: Necesita ser un string, recibio ${user.password}
    `
}

export const generateConectErrorInfo = dataBase=>{
    return `No se puede conectar a la DB ${dataBase.URI} no válida`
}


export const generateProductsErrorInfo =  product =>{

    return `faltan algunos de estos datos obligatorios:
        -title: Debe ser tipo string, recibe ${product.title}
        -description: Debe ser tipo string, recibe ${product.description}
        -price: Debe ser de tipo Number, recibe ${product.price}
        -code: Debe ser de tipo String, recibe ${product.code}
        -stock: Debe ser de tipo Number, recibe ${product.stock}
        -category: Debe ser tipo string, recibe ${product.category}`
        
}