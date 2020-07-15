var socket = io();

const userstochat = document.getElementById('users_to_chat');
const myId = userstochat.dataset.id;
const text_search = document.getElementById('text_search')
const btn_search = document.getElementById('btn_search')

var roomId;
var theUserId;
console.log(innerHeight);

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

    async postIdUser(id){
        const res = await fetch('/userToChat/'+id,{
            method: 'POST',
            body: id
        })
        const data = await res.json()
        console.log(data);
        roomId = data.room._id;
        dataSocket.joinUserToSocket()
        uiChat.showUserToChat(data)
    }

    async sendMessage(text){
        let dataSended = { text:text, roomId:roomId }
        const res = await fetch('/messageSend/'+JSON.stringify(dataSended),{
            method: 'POST',
            body: text
        })   
        const data = await res.json()
        console.log(data);
    }
}

class DataSocket{
    sendMessage(message){
        console.log(theUserId);
        socket.emit('send_message',{
            roomId:roomId,
            message:message,
            myId:myId,
            theUserId:theUserId
        })
    }

    joinUserToSocket(){
        socket.emit('user_to_join', {
            roomId:roomId,
            myId:myId
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
    async searchUser(){
        const data =  await dataUsers.getUsers()
        let users = data.users;
        var textS = text_search.value.toLowerCase()
        console.log(users);
        userstochat.innerHTML = '';
        
        for(let user of users){
            let nombre = user.nombre.toLowerCase();
            if (myId != user._id) {
                if (nombre.indexOf(textS) !== -1) {
                    userstochat.innerHTML += `
                    <div  class="ubs">
                        <a class="chat_name" id="a" data-users="${user._id}" href="/chat/${user.nombre}">
                            <div class="userFotoSelect" id="a" data-users="${user._id}">
                                <img src="${user.userFoto}" alt="">
                            </div>
                            <div class="contentUserSelect" id="a" data-users="${user._id}">
                                <p class="userNameSelect" id="a" data-users="${user._id}">
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

    async showUsers(){
        const users = await dataUsers.getUsers()
        var user = users.users;
        userstochat.innerHTML = '';
        for(var i = 0; i < user.length; i++){
            console.log(user[i]);
            
            if (myId != user[i]._id) {
                for(var c = 0; c < user[i].rooms.length; c++){
                    if(user[i].rooms[c].messages.length > 0){
                        if(user[i].rooms[c].myId === myId || user[i].rooms[c].youId === myId){
                            let oldMessage = user[i].rooms[c].messages.pop()
                            userstochat.innerHTML += `
                            <div  class="ubs">
                                <a class="chat_name" id="a" data-users="${user[i]._id}" href="/chat/${user[i].nombre}">
                                    <div class="userFotoSelect" id="a" data-users="${user[i]._id}">
                                        <img src="${user[i].userFoto}" alt="">
                                    </div>
                                    <div class="contentUserSelect" id="a" data-users="${user[i]._id}">
                                        <p class="userNameSelect" id="a" data-users="${user[i]._id}">
                                            ${user[i].nombre}
                                        </p>
                                        <p class="oldMessage" data-users="${user[i]._id}">
                                            ${oldMessage.message}
                                        </p>
                                    </div>
                                </a>
                            </div>`
                        }
                    }
                }
            }
        }
        
    }

    selectUserToChat(e) {
        const idUser = e.target.dataset.users;
        theUserId = e.target.dataset.users;
        dataUsers.postIdUser(idUser)
    }

    async showUserToChat(data){
       
        console.log(data);
        if (innerWidth <= 500) {
            document.querySelector('.box_user').style.display = "none"
            document.querySelector('.box_contain_chat').style.display = "block"
        }
        let contain_chat = document.getElementById('contain_chat')

        contain_chat.innerHTML =`
        <div class="box">
            <div class="header">
                <div class="fn">
                    <div class="fotoUser">
                        <img src="${data.user.userFoto}" alt="">
                    </div>
                    <div class="t_n">
                        <p class="name_u">${data.user.nombre}</p>
                        <p class="user_typping" id="user_typping"></p>
                    </div>
                </div>
                <div class="ue">
                    <samp>${data.user.email}</samp>
                </div>
            </div>
            <div id="message" class=""> </div>
        </div>
        `
        this.showMessage(data.room.messages)
    }

    showMessage(messages){
        let divMessage = document.getElementById('message')
        console.log(messages);

        for(let message of messages){
            if(message.myIdMsg == myId){
                divMessage.innerHTML += `
                <div class="box_message">
                    <div class="opklo">
                        <span>
                            ${message.message}
                        </span>
                    </div>
                </div>`;
            }else{
                divMessage.innerHTML += `
                <div class="box_message">
                    <div class="opkl">
                        <span>
                            ${message.message}
                        </span>
                    </div>
                </div>`
            }
        }
        var x = divMessage.scrollHeight
        divMessage.scrollBy(0, x);
    }

    showMessageTwo(message){
        let divMessage = document.getElementById('message')
        console.log(message);
        
        if(message.roomId == roomId){
            divMessage.innerHTML += `
            <div class="box_message">
                <div class="opkl">
                    <span>
                        ${message.message}
                    </span>
                </div>
            </div>`
        }
        var x = divMessage.scrollHeight
        divMessage.scrollBy(0, x);
    }

    showMessagethree(message){
        let divMessage = document.getElementById('message')
        divMessage.innerHTML += `
        <div class="box_message">
            <div class="opklo">
                <span>
                    ${message}
                </span>
            </div>
        </div>`
        var x = divMessage.scrollHeight
        divMessage.scrollBy(0, x);
    }
}

const uiChat = new UiChat();
const dataUsers = new DataUsers();
const dataSocket = new DataSocket();

text_search.addEventListener('keyup', uiChat.searchUser)

userstochat.addEventListener('click' , (e) => {
    e.preventDefault()
    if (e.target.classList.contains('chat_name')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('sampMSG')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('userNameSelect')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('userFotoSelect')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('contentUserSelect')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('dateS')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }else if (e.target.classList.contains('oldMessage')) {
        e.preventDefault()
        uiChat.selectUserToChat(e)
    }
})

addEventListener('DOMContentLoaded', () =>{
    if(innerWidth <= 500){
        document.querySelector('.box_user').style.display = "block"
        document.querySelector('.box_contain_chat').style.display = "none"
    }
})

// on socket
socket.on('send_message', (data) => {
    let user_typping = document.getElementById('user_typping')
    user_typping.innerText = "";
    uiChat.showMessageTwo(data)
    uiChat.showUsers()
})

socket.on('user_is_typping', (data)=> {
    let user_typping = document.getElementById('user_typping')
    user_typping.innerText = "Esta escribiendo"
    console.log(data);
})

let form = document.getElementById('form')
const text = document.getElementById('text_msg')
text.addEventListener('keyup', dataSocket.userIsTypping)

form.addEventListener('submit', (e) =>{
    e.preventDefault()
    const text_msg = document.getElementById('text_msg').value;
    
    if(text_msg.trim() === '') return false

    uiChat.showMessagethree(text_msg)
    dataSocket.sendMessage(text_msg)
    uiChat.showUsers()

    form.reset()
})