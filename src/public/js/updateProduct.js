




let btnUpdate = document.getElementById('btnUpdateProduct')
let form = document.getElementById('form-update')



btnUpdate.addEventListener('click', (event)=>{
    
    
    var formData = new FormData(form);
    var data = {
    id:formData.get("id"),
    title: formData.get("title"),
    description:formData.get("description"),
    price: formData.get("price"),
    thumbnail:formData.get("thumbnail"),
    code:formData.get("code"),
    category:formData.get("category"),
    stock: formData.get('stock')


  };
    
  if(data.title=='' || data.description=='' || data.price=='' || data.code=='' || data.category == '' || data.stock == ''){
    alert ('Todos los campos son obligatorios.')
    event.preventDefault()
  }
  

  if(data.title!=='' && data.description!=='' && data.price!=='' && data.code!=='' && data.category !== '' && data.stock !== ''){
  fetch(`https://ecommercecoderhouse2-production.up.railway.app/api/products/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      
    }
  }).then(respose=> {
      return respose.text()
    
  }).then(data=>{
    alert(data)
    location.reload()
    
    
  })
}
  
})

