
const userstochat = document.getElementById('users_to_chat');
const _myId = userstochat.dataset.id;
const text_search = document.getElementById('text_search')
const btn_search = document.getElementById('btn_search')

var roomId;
var theUserId;
var socket = io();
var messageList;

document.addEventListener('DOMContentLoaded', () => {
    uiChat.showUsers()
    const h = innerHeight;
    document.querySelector('.container').style.height = h+'px'
})

class DataUsers{
    async getUsers(){
        try {
            const res = await fetch('/users')
            const data = await res.json()
            return data
        } catch (error) {
            console.log(error);
        }
    }

    async getMyRooms(){
        try {
            const req = await fetch('/my_rooms')
            const res = await req.json()
            return res
        } catch (error) {
            console.log(error);
        }
    }

    //al dar click a un usuario esta funcion envia el id del usuario para verificar si tienen un room 
    //si tiene un room lo manda y si no crea uno nuevo
    async postIdUser(id, lastMsg){
        const res = await fetch('/userToChat/'+id,{
            method: 'POST',
            body: id
        })

        const data = await res.json()
        
        roomId = data.room._id;
        dataSocket.joinUserToSocket()
        uiChat.showUserToChat(data)
        dataSocket.viewMessage(lastMsg)
    }

    async sendMessage(text){
        let dataSended = { 
            text:text, 
            roomId:roomId 
        }

        const res = await fetch('/messageSend/'+JSON.stringify(dataSended),{
            method: 'POST',
            body: JSON.stringify(dataSended),
            headers: {
                'Content-Type':'application/json'
            }
        })   
        const data = await res.json()
    }
}

class DataSocket{
    sendMessage(message){
        socket.emit('send_message',{
            roomId:roomId,
            message:message,
            myId:_myId,
            theUserId:theUserId
        })
    }

    viewMessage(id_msg){
        socket.emit('view_message', {
            roomId:roomId,
            myId:_myId,
            theUserId:theUserId,
            id_msg:id_msg
        })
    }

    notificar_msj(){
        socket.emit('notificacion_msj',{
            roomId:roomId,
            myId:_myId,
            theUserId:theUserId
        })
    }

    joinUserToSocket(){
        socket.emit('user_to_join', {
            roomId:roomId,
            myId:_myId
        })
    }

    reciveMessage(){
        socket.on('send_message', (data) => {
            uiChat.showMessageTwo(data)
        })
    }

    userIsTypping(){
        socket.emit('user_is_typping', {
            roomId:roomId
        })
    }
}

class UiChat{
    //buscar usuarios para el chat
    async searchUser(){
        const data =  await dataUsers.getUsers()
        let users = data.users;
        var textS = text_search.value.toLowerCase()
        userstochat.innerHTML = '';
        
        for(let user of users){
            let nombre = user.nombre.toLowerCase();
            if (_myId != user._id) {
                if (nombre.indexOf(textS) !== -1) {
                    userstochat.innerHTML += `
                    <div  class="ubs seleccionar">
                        <a class="chat_name seleccionar" id="a" data-users="${user._id}" href="/chat/${user.nombre}">
                            <div class="userFotoSelect seleccionar" id="a" data-users="${user._id}">
                                <img class="seleccionar" src="${user.userFoto? user.userFoto : '../userIcon.jpg'}" alt="">
                            </div>
                            <div class="contentUserSelect seleccionar" id="a" data-users="${user._id}">
                                <p class="userNameSelect seleccionar" id="a" data-users="${user._id}">
                                    ${user.nombre}
                                </p>
                            </div>
                        </a>
                    </div>`
                }
            }
        }
        if (userstochat.innerHTML === '') {
            userstochat.innerHTML += '<div class="ubs">Usuario no encontrado...</div>'
        }
    }

    //monstrar la lista de usuarios
    async showUsers(){
        const users = await dataUsers.getMyRooms()

        userstochat.innerHTML = '';

        let rooms = users.sort((a, b) =>{
            if(a.dateMessage > b.dateMessage) return -1
            if(a.dateMessage < b.dateMessage) return 1
            return 0
        })
        
        for(var i = 0; i < rooms.length; i++){
        
            if(rooms[i].messages.length > 0){
                
                let lastMessage = rooms[i].messages.pop()
                let time = new Date(lastMessage.dateMsg)
                let timeToDay = moment(time).format('LT')
        
                if(rooms[i].myId._id == _myId){
                    userstochat.innerHTML += `
                    <div  class="ubs">
                        <a class="chat_name seleccionar" id="a" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}" href="/chat/${rooms[i].youId._id}">
                            <div class="userFotoSelect seleccionar" id="a" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                <img src="${rooms[i].youId.userFoto? rooms[i].youId.userFoto : '../userIcon.jpg'}" alt="">
                            </div>
                            <div class="contentUserSelect seleccionar" id="a" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                <p class="userNameSelect seleccionar" id="a" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                    ${rooms[i].youId.nombre}
                                </p>
                                <div class="oldMessage seleccionar" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                    ${(lastMessage.myIdMsg != _myId)?
                                        `<p class="seleccionar ${(lastMessage.viewMsg.view == false)? 'view_msg':''}" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                            ${lastMessage.message}
                                        </p>
                                        <samp class="hora seleccionar ${(lastMessage.viewMsg.view == false)? 'view_msg':''}" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                            ${ timeToDay }
                                        </samp>` :
                                        `<p class="seleccionar" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">${lastMessage.message}</p>
                                        <samp class="hora seleccionar" data-users="${rooms[i].youId._id}" data-lmsg="${lastMessage._id}">
                                            ${ timeToDay }
                                        </samp>`
                                    }
                                </div>
                            </div>
                        </a>
                    </div>`
                }else{
                    userstochat.innerHTML += `
                    <div  class="ubs">
                        <a class="chat_name seleccionar" id="a" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}" href="/chat/${rooms[i].myId._id}">
                            <div class="userFotoSelect seleccionar" id="a" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                <img src="${rooms[i].myId.userFoto? rooms[i].myId.userFoto : '../userIcon.jpg'}" alt="">
                            </div>
                            <div class="contentUserSelect seleccionar" id="a" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                <p class="userNameSelect seleccionar" id="a" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                    ${rooms[i].myId.nombre}
                                </p>
                                <div class="oldMessage seleccionar" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                    ${(lastMessage.myIdMsg != _myId)?
                                        `<p class="seleccionar ${(lastMessage.viewMsg.view == false)? 'view_msg':''}" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                            ${lastMessage.message}
                                        </p>
                                        <samp class="hora seleccionar ${(lastMessage.viewMsg.view == false)? 'view_msg':''}" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                            ${ timeToDay }
                                        </samp>` :
                                        `<p class="seleccionar" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">${lastMessage.message}</p>
                                        <samp class="hora seleccionar" data-users="${rooms[i].myId._id}" data-lmsg="${lastMessage._id}">
                                            ${ timeToDay }
                                        </samp>`
                                    }
                                </div>
                            </div>
                        </a>
                    </div>`
                }
            }
        }
    }

    selectUserToChat(e) {
        const idUser = e.target.dataset.users;
        theUserId = e.target.dataset.users;
        const lastMsg = e.target.dataset.lmsg
        dataUsers.postIdUser(idUser, lastMsg)
    }

    async showUserToChat(data){
        let data_ = await dataUsers.getUsers()
        
        document.querySelector('.img_message').style.display = 'none'
        document.querySelector('.box_form').style.display = 'flex'

        //para dispocitivos mobiles
        if (innerWidth <= 500) {
            document.querySelector('.box_user').style.display = "none"
            document.querySelector('.box_contain_chat').style.display = "block"
        }

        let contain_chat = document.getElementById('contain_chat')

        //monstrar el usuario que le ayas cliquiado para el chat
        contain_chat.innerHTML =`
        <div class="box">
            <div class="header">
                <div class="fn">
                    <div class="fotoUser">
                        <img src="${data.user.userFoto? data.user.userFoto : '../userIcon.jpg'}" alt="">
                    </div>
                    <div class="t_n">
                        <a href="/perfil/${data.user._id}">
                            <p class="name_u">${data.user.nombre}</p>
                        </a>
                        <p class="user_typping" id="user_typping"></p>
                    </div>
                </div>
                <div class="ue">
                    <samp>${data.user.email}</samp>
                    <a href="#" class="atras" style="display: none">Atras</a>
                </div>
            </div>
            <div id="message" class=""> </div>
        </div>
        `
        if (innerWidth <= 500) {
            document.querySelector('.atras').style.display = "block"
        }
        messageList = data.room.messages;
        this.showMessage(data.room.messages)

    }

    showMessage(messages){
        let divMessage = document.getElementById('message');
        
        //monstrar los mensajes
        divMessage.innerHTML = ''
        for(var i = 0; i < messages.length; i++){
            moment.locale('es-do')
            let toDay = new Date()
            let time = new Date(messages[i].dateMsg)
            let viewLastMsg = new Date(messages[i].viewMsg.dateView)
            let timeAgo = moment(time).format('dddd');
            let timeToDay = moment(time).format('LT')

            let timeAgo_lastView = moment(viewLastMsg).format('dddd');
            let timeToDay_lastView = moment(viewLastMsg).format('LT')
    
            if(messages[i].myIdMsg == _myId){
                divMessage.innerHTML += `
                <div class="box_message">
                    <div class="opklo">
                        <span>
                            <p>${messages[i].message}</p>
                            <samp class="horas">
                                ${(toDay.getDate() === time.getDate())? timeToDay : timeAgo+' '+timeToDay}
                            </samp>
                        </span>
                        <div id="vista" class="vista">
                            <p>${(messages.length-1 == i && messages[i].viewMsg.view == true)? 
                                `Vista: ${(toDay.getDate() === viewLastMsg.getDate())? timeToDay_lastView : timeAgo_lastView+' '+timeToDay_lastView}` 
                            : ''
                            }</p>
                        </div>
                    </div>
                </div>`;
            }else{
                divMessage.innerHTML += `
                <div class="box_message">
                    <div class="opkl">
                        <span>
                            <p>${messages[i].message}</p>
                            <samp class="horas_u">
                                ${(toDay.getDate() === time.getDate())? timeToDay : timeAgo+' '+timeToDay}
                            </samp>
                        </span>
                    </div>
                </div>`
            }
        }
        var x = divMessage.scrollHeight
        divMessage.scrollBy(0, x);
    }

    //estos son los mensajes que el usuario me manda
    showMessageTwo(data){
        let message = data.room_.messages.pop()
        
        let time = new Date()
        let divMessage = document.getElementById('message')
        console.log(message);
        

        if(message.myIdMsg != _myId){
            divMessage.innerHTML += `
            <div class="box_message">
                <div class="opkl">
                    <span>
                        <p>${message.message}</p>
                        <samp class="horas_u">
                            ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </samp>
                    </span>
                </div>
            </div>`
        }else{
            divMessage.innerHTML += `
            <div class="box_message">
                <div class="opklo">
                    <span>
                        <p>${message.message}</p>
                        <samp class="horas">
                            ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </samp>
                    </span>
                </div>
            </div>`
        }
        
        var x = divMessage.scrollHeight
        divMessage.scrollBy(0, x);
    }
}

const uiChat = new UiChat();
const dataUsers = new DataUsers();
const dataSocket = new DataSocket();

text_search.addEventListener('keyup', uiChat.searchUser)

//el boton 'atras'
document.querySelector('.box_contain_chat').addEventListener('click', e =>{
    if(e.target.classList.contains('atras')){
        e.preventDefault()
        document.querySelector('.box_user').style.display = "block"
        document.querySelector('.box_contain_chat').style.display = "none"
    }
})

//capturar el evento cuando el usuario da click a otro usuario en la lista del chat
userstochat.addEventListener('click' , (e) => {
    e.preventDefault()
    if (e.target.classList.contains('seleccionar')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }
})

//para dispocitivos mobiles
addEventListener('DOMContentLoaded', () =>{
    if(innerWidth <= 500){
        document.querySelector('.box_user').style.display = "block"
        document.querySelector('.box_contain_chat').style.display = "none"
    }
})



// on socket
//-------------------------------------------------------------------------------
//
socket.on('send_message', (data) => {
    let user_typping = document.getElementById('user_typping')
    user_typping.innerText = "";
    if(data.room_._id === roomId){
        uiChat.showMessage(data.room_.messages)
    }
})

socket.on('view_message', (data) =>{
    uiChat.showUsers()
    
})
socket.on('view_message_room', data =>{
    if(data.room._id === roomId){
        uiChat.showMessage(data.room.messages)
    }
})

//actualiza toda la aplicacion para ver los cambios
socket.on('notificacion_msj', (data) => {
    uiChat.showUsers()
})

// cuando el usuario esa escribiendo un mensaje
socket.on('user_is_typping', (data)=> {
    if(data.roomId == roomId){
        let user_typping = document.getElementById('user_typping')
        user_typping.innerText = "Esta escribiendo"
    }
})

let form = document.getElementById('form')
const text = document.getElementById('text_msg')
text.addEventListener('keyup', dataSocket.userIsTypping)

//enviar mensajes cuando preciones el enter
text.addEventListener('keyup', e =>{
    let key = event.which || event.keyCode;
    if(key === 13){
        if(text.value.trim() === '') return false
        
        dataSocket.sendMessage(text.value)
        dataSocket.notificar_msj()
        form.reset()
    }
})

//enviar mensajes cuando preciones el boton
form.addEventListener('submit', (e) =>{
    e.preventDefault()
    const text_msg = document.getElementById('text_msg').value;
  
    if(text_msg.trim() === '') return false
    
    dataSocket.sendMessage(text_msg)
    dataSocket.notificar_msj()
    form.reset()
})