let idCart = document.getElementById('idCart').innerText.split(' ')[2]

function deleteProduct (idProduct){
    fetch(`http://localhost:8080/api/carts/${idCart}/products/${idProduct}`, {
    method: "DELETE",
    
  }).then(function(response) {

    
    location.reload()
    
  })
}




