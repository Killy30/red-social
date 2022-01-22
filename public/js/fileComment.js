const container = document.getElementById('container')
const divComments = document.getElementById('comments')
const formComment = document.getElementById('formComment')

import Data from './RequestData.js'

const id = container.dataset.id;
const my_id = container.dataset.id_m;

class Datas {
    async getData(){
        let response = await fetch('/postComment/'+id)
        let res = await response.json()
        return res 
    }
}

class UiPost {
    async addPost(){
        let data = await Data.getPostToComment(id)
        let likes = data.post.like.includes(data.user._id)
        let saved = data.user.postsSaved.includes(data.post._id);

        if(data.post.fotoPost !== undefined){
            var ext = data.post.fotoPost.split('.',2)[1].toLowerCase()
        }
        container.innerHTML = `<div class="post">
           
            <div class="divImg" ${(data.post.fotoPost == undefined)? ' style="display: none"' : ''}>
                ${
                    ( ext === "mp4")
                    ? `<video controls 
                            class="view_v" 
                            src="${data.post.fotoPost}"
                        </video>`
                    : `<img class="view" data-img_="${data.post.fotoPost}" src="${data.post.fotoPost}" alt="">`
                }
            </div>
            <div class="headerPost">
                <div class="img_user">
                    <img src="${data.post.user.userFoto? data.post.user.userFoto : '../userIcon.jpg'}" alt="">
                </div>
                <a href="${(data.post.user._id == data.user._id)?'/my_perfil':`/perfil/${data.post.user._id}`}"> 
                    <h2>${data.post.user.nombre}</h2>
                </a>
            </div>
            <div class="postTitulo">
                <div class="p">
                    <p>${data.post.descripcion.replace(/\n/g, '<br>')}</p>
                </div>
            </div> 
            <div class="info">
                <div class="like">
                    <a href="#" data-my_id="${id}" data-id="${data.post._id}" id="btnId" class="like a_l_c ${likes == true?"verde":""}" >
                        <span class="material-icons-outlined like" data-id="${data.post._id}" data-likes="${data.post.like.length}">
                            favorite_border
                        </span> 
                        ${data.post.like.length}
                    </a>                             
                </div>
                <div ${(data.post.fotoPost == undefined)? ' style="display: none"' : ''}>
                    <a class="a_l_c guardar ${saved == true?"verde":""}" data-id="${data.post._id}" href="">
                        <span class="material-icons-outlined guardar" data-id="${data.post._id}">bookmark_border</span> 
                    </a>
                </div>

            </div>
        </div>`
        this.addComments(data)
    }

    addComments(data){
        divComments.innerHTML = '';
        for(var i = data.post.coment.length-1; i >=0; i--) {
            for(var c = data.comments.length-1; c >=0; c--) {
                if(data.post.coment[i]._id === data.comments[c]._id){
                    divComments.innerHTML += `<div class="box_cmt">
                        <div class="comentarios">
                            <div class="hjk">
                                <div class="c_user_foto">
                                    <img src="${data.comments[c].user.userFoto? data.comments[c].user.userFoto : '../userIcon.jpg'}" alt="">
                                </div> 
                            </div>
                            <span>
                                <a class="c_a_user" href="${(data.comments[c].user._id == my_id)? '/my_perfil' : `/perfil/${data.comments[c].user._id}`}">
                                    <b>${data.comments[c].user.nombre}</b> 
                                </a>
                                ${data.post.coment[i].comentario}
                            </span>
                        </div>
                    </div>`
                } 
            }
        }
        
    }

    // funcion para cambiar el color del boton 'Guardar' cuando un post esta guardado
    // changeColor(data, e){
    //     if(data==false){
    //         e.target.style.color='rgb(2, 170, 2)'
    //     }else{
    //         e.target.style.color='rgb(13, 13, 245)'
    //     }
    // }

    // //funcion para cambiar el estilo del boton 'Like'
    // changeColorLike(data, e){
    //     if(data.v_f == false){
    //         e.target.style.color='rgb(2, 170, 2)'
    //     }else{
    //         e.target.style.color='rgb(13, 13, 245)'
    //     }
    // }
}



const add = new UiPost()
add.addPost()

// evento para enviar los comentarios
formComment.addEventListener('submit', async(e) => {
    e.preventDefault()
    const comentario = document.getElementById('comentario').value;

    const data = {
        id: id,
        comment: comentario
    }
    let response = await fetch('/comment',{
        method: 'post',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        },
    })
    let res = await response.json()
    console.log(res);
    add.addPost()

    formComment.reset();
})

//DOM
// container.addEventListener('click', (e) => {

//     //like
//    if(e.target.classList.contains('like') ){  
//         e.preventDefault()
//         const id = e.target.dataset.id;
//         const my_id = e.target.dataset.my_id;

//         const _ids = {
//             my_id: my_id,
//             post_id: id
//         }
      
//         fetch('/like/'+ JSON.stringify(_ids), {
//             method:'POST',
//             body: JSON.stringify(id) 
//         })
//         .then(res => res.json())
//         .then(data => {
//             add.changeColorLike(data, e)
//             add.addPost()
//         })
//     }

//     //guardar
//     if(e.target.classList.contains('guardar') ){  
//         e.preventDefault()
//         const id = e.target.dataset.id;
        
//         fetch('/savedPost/'+ id, {
//             method:'POST',
//             body: JSON.stringify(id) 
//         })
//         .then(res => res.json())
//         .then(data => {
//             add.changeColor(data, e)
//             add.addPost()
//         })
//     }
// })
