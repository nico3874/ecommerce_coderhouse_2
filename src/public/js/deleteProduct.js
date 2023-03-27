let btnDelete = document.getElementById('btnProductDelete')
let form = document.getElementById('form-delete')



btnDelete.addEventListener('click', (event)=>{
    
    
    var formData = new FormData(form);
    var data = {
    id:formData.get("id"),
    


  };
    
 
  fetch(`http://localhost:8080/api/products/${data.id}`, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      
    }
  }).then(function(response) {
    console.log("Formulario enviado con éxito");
    alert('El producto se eliminó correctamente!!')
    
  });

  
})