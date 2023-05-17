let idCart = document.getElementById('idCart').innerText.split(' ')[2]

function deleteProduct (idProduct){
    fetch(`ecommercecoderhouse2-production.up.railway.app/api/carts/${idCart}/products/${idProduct}`, {
    method: "DELETE",
    
  }).then(function(response) {

    
    location.reload()
    
  })
}




