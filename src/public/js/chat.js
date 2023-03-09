
const socket = io()



let user;
let chatBox = document.getElementById('chatBox')


swal({
    title: "Identificate",
    content: "input",
    
    
  }).then(result=>{
    !result && swal("Necesita un nombre");
    user= result
    let userName = document.getElementById("nameUser")
    userName.innerHTML = user
    socket.emit('authenticated', user)
  })

  chatBox.addEventListener('keyup', event=>{
    if(event.key == "Enter"){
        if(chatBox.value.trim().length >0){
            socket.emit('message',{
                user,
                message: chatBox.value
            })
            chatBox.value = ''
        }
    }
  })

  socket.on('newLogin', data =>{
    if (data != user){
      Toastify({

        text: `${data} se ha conectado`,
        
        duration: 3000
        
        }).showToast();
    }
      
        
      
    
  })

  
  
  
  socket.on('messageLogs', data=>{
    let log = document.getElementById('messageLogs')

    let messages = ''
    data.forEach(message => {
      messages += `<b> ${message.user}</b>: ${message.message}<br>`
    });
    
    log.innerHTML = messages

  })