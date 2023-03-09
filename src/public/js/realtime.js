
const socket = io()

const newHtml = document.getElementById("list")

socket.on('productos',  (data) =>{

    const allproducts = data.map(element=>`
    
    <h2>${element.title}</h2>
        <ul>
            <li>ID: ${element.id}</li>
            <li>Descrpción:${element.description}</li>
            <li>Precio:${element.price}</li>
            <li>Código:${element.code}</li>
            <li>Stock:${element.stock}</li>
        </ul>
    
    
    `

    ).join(" ")

    
    newHtml.innerHTML = allproducts
    
        
    
})





/* socket.on('productos', (data)=>{
    const newList = []
    data.forEach(element => {
        
     newList.push(newHtml.innerHTML = `
     <h2>${element.title}</h2>
        <ul>
            <li>ID: ${element.id}</li>
            <li>Descrpción:${element.description}</li>
            <li>Precio:${element.price}</li>
            <li>Código:${element.code}</li>
            <li>Stock:${element.stock}</li>
        </ul>`)  
    })
    console.log(newList)
    newHtml.innerHTML = newList
}) */