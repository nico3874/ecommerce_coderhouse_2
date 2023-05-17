


let btnDelete = document.getElementById('btnDeleteteUser')
let btnUpdate = document.getElementById('btnUpdateUser')
let form = document.getElementById('form-update')
let btnDeleteteUsersAct = document.getElementById('btnDeleteteUsersAct')



btnUpdate.addEventListener('click', (event)=>{
    
    
    var formData = new FormData(form);
    var data = {
    id:formData.get("id"),
    role:formData.get("role")

  };
    
  event.preventDefault()
  
  fetch(`http://localhost:8080/changerole`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      
    }
  }).then(function(response) {
    console.log("Formulario enviado con éxito");
    document.getElementById("name").value = ''
    document.getElementById("lastName").value = ''
    document.getElementById("email").value = ''
    document.getElementById("role").value = ''
    return alert('El Role fue cambiado')
    
  });

})

btnDelete.addEventListener('click', (event)=>{
    
    
  var formData = new FormData(form);
  var data = {
  id:formData.get("id"),
  

};
  
event.preventDefault()

fetch(`http://localhost:8080/deleteuser`, {
  method: "DELETE",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
    
  }
}).then(function(response) {
  console.log("Formulario enviado con éxito");
  document.getElementById("name").value = ''
  document.getElementById("lastName").value = ''
  document.getElementById("email").value = ''
  document.getElementById("role").value = ''
  return alert('Usuario eliminado')
  
});

})

btnDeleteteUsersAct.addEventListener('click', (event)=>{
  fetch(`https://ecommercecoderhouse2-production.up.railway.app/api/user`, {
  method: "DELETE",
  
  headers: {
    "Content-Type": "application/json",
    
  }
}).then(response=> {
    return response.text()
  
}).then(data=>{
  alert(data)
})
})


