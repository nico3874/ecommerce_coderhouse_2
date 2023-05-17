const btnChange = document.getElementById('btnChangeUser')
const user = document.getElementById('idUser')


btnChange.addEventListener('click', (event)=>{
    
    fetch(`http://localhost:8080/api/user/premium/${user.value}`, {
       method:"POST",
       headers: {
        "Content-Type": "application/json",
        
      }
    }).then(response=>{
        
        return response.text()
    }).then(data=>{
         alert(data)
         location.reload()

    })
})


