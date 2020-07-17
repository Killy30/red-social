const container = document.getElementById('container')
const divComments = document.getElementById('comments')
const formComment = document.getElementById('formComment')
const id = container.dataset.id;

class Datas {
    async getData(){
        let response = await fetch('/postComment/'+id)
        let res = await response.json()
        return res
            // .then(res => res.json())
            // .then(data => {
            //     console.log(data, id);
            //     add.addPost(data)
            // })
    }
}

class UiPost {
    async addPost(){
        let data = await getPost.getData()

        console.log(data.post.user.userFoto);
        let likes = data.post.like.includes(data.user._id)
        let saved = data.user.postsSaved.includes(data.post._id);

        container.innerHTML = `<div class="post">
            <div class="headerPost">
                <div class="img_user">
                    <img src="${data.post.user.userFoto}" alt="">
                </div>
                <a href="${(data.post.user._id == data.user._id)?'/my_perfil':`/perfil/${data.post.user._id}`}"> 
                    <h2>${data.post.user.nombre}</h2>
                </a>
            </div>
            <div class="postTitulo">
                <div class="p">
                    <p>${data.post.descripcion}</p>
                </div>
            </div> 
            <div class="divImg">
                <img class="view" data-img_="${data.post.fotoPost}" src="${data.post.fotoPost}" alt="">
            </div>
            <div class="info">
                <div class="like">
                    ${(likes == true)?
                        `<a href="#" data-my_id="${id}" data-id="${data.post._id}" id="btnId" class="like a_l_c verde" >
                            Like: ${data.post.like.length}
                        </a>` :            
                        `<a href="#" data-my_id="${id}" data-id="${data.post._id}" id="btnId" class="like a_l_c" >
                            Like: ${data.post.like.length}
                        </a>`
                    }
                </div>
                <div ${(data.post.fotoPost == undefined)? ' style="display: none"' : ''}>
                    ${
                        (saved==true) ?
                        `<a class="a_l_c guardar verde" data-id="${data.post._id}" href="">
                            Guardar
                        </a>` : 
                        `<a class="a_l_c guardar" data-id="${data.post._id}" href="">
                            Guardar
                        </a>`
                    }
                </div>
                <div>
                    <p>
                        Comentarios: ${data.post.coment.length}
                    </p>
                </div>
            </div>
        </div>`
        this.addComments(data)
    }

    addComments(data){
        divComments.innerHTML = '';
        for(var i = data.post.coment.length-1; i >=0; i--) {
            console.log(data.post.coment[i]);
            for(var c = data.comments.length-1; c >=0; c--) {
                if(data.post.coment[i]._id === data.comments[c]._id){
                    divComments.innerHTML += `<div class="comentarios">
                        <b>${data.comments[c].user.nombre}</b>
                        <span>${data.post.coment[i].comentario}</span>
                    </div>`
                } 
            }
        }
        
    }

    // funcion para cambiar el color del boton 'Guardar' cuando un post esta guardado
    changeColor(data, e){
        console.log(data);
        if(data==false){
            e.target.style.color='rgb(2, 170, 2)'
        }else{
            e.target.style.color='rgb(13, 13, 245)'
        }
    }

    //funcion para cambiar el estilo del boton 'Like'
    changeColorLike(data, e){
        console.log(data.v_f);
        if(data.v_f == false){
            e.target.style.color='rgb(2, 170, 2)'
        }else{
            e.target.style.color='rgb(13, 13, 245)'
        }
    }
}


const getPost = new Datas()
const add = new UiPost()
add.addPost()

// evento para enviar los comentarios
formComment.addEventListener('submit', (e) => {
    e.preventDefault()
    const comentario = document.getElementById('comentario').value;

    const formData = new FormData()
    formData.append('comment', comentario)

    const data = {
        id: id,
        comment: comentario
    }

    console.log(formData);
    fetch('/coment/'+JSON.stringify(data), {
        method:'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        add.addPost()
    })

    formComment.reset();
})

//DOM
container.addEventListener('click', (e) => {
    //eliminar
    if(e.target.classList.contains('eliminar')){
        e.preventDefault()
        if(confirm('Deseas eliminar esa publicacion')){
            console.log(e.target.dataset.eli);
            const id = e.target.dataset.eli;

            fetch('/eliminar/'+id, {
                method:'GET'
            }) 
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
            })
        }
    }

    //like
   if(e.target.classList.contains('like') ){  
        e.preventDefault()
        const id = e.target.dataset.id;
        const my_id = e.target.dataset.my_id;

        console.log(my_id, id);
        const _ids = {
            my_id: my_id,
            post_id: id
        }
      
        fetch('/like/'+ JSON.stringify(_ids), {
            method:'POST',
            body: JSON.stringify(id) 
        })
        .then(res => res.json())
        .then(data => {
            add.changeColorLike(data, e)
            add.addPost()
        })
    }

    //guardar
    if(e.target.classList.contains('guardar') ){  
        e.preventDefault()
        const id = e.target.dataset.id;
        
        fetch('/savedPost/'+ id, {
            method:'POST',
            body: JSON.stringify(id) 
        })
        .then(res => res.json())
        .then(data => {
            console.log(data, id);
            add.changeColor(data, e)
            add.addPost()
        })
    }

    // view img
    if(e.target.classList.contains('view') ){  
        e.preventDefault()
        console.log('kkkkk');
        let img = e.target.dataset.img_
        let h = innerHeight;
        let w = innerWidth;
        document.getElementById('off').style.display = 'none'
        const view_img = document.getElementById('view_img')
        view_img.style.display = "flex"
        view_img.style.width = w+'px'
        view_img.style.height = h+'px'
    
        view_img.innerHTML = `
            <div class="dg_img">
                <img class="view" src="${img}" alt="">
                <button class="btn_x" id="btn_x">X</button>
            </div>
        `
        
        console.log('listo', innerHeight, innerWidth);
    }
 
})

window.addEventListener('click', e => {
    if(e.target.classList.contains('btn_x') ){
        e.preventDefault()
        console.log('jsgu');
        view_img.style.display = "none"
        document.getElementById('off').style.display = 'flex'

    } 
})