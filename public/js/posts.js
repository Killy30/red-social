const div = document.getElementById('div');
const btnSbmit = document.getElementById('btnSbmit');
const divComments = document.createElement('div');
const idUser = div.dataset.id; 

document.addEventListener('DOMContentLoaded', () => {
    uiAddPost.addPost()
})

btnSbmit.addEventListener('click', async(e)=> {
    e.preventDefault();
    const descripcion = document.getElementById('descripcion').value;
    const image = document.getElementById('image').files;
    
    //validar si los campos estan vacios 
    if(descripcion.trim() ==="" && image.length === 0) return false;

    //validar si la extencion del archivo es permitida
    if(image.length !== 0){
        let ext_ = image[0].name.split('.', 2)[1].toLowerCase()

        if(ext_ !== 'jpg' && ext_ !== 'jpeg' && ext_ !== 'png' && ext_ !== 'mp4' && ext_ !== 'jfif' && ext_ !== 'gif'){
            alert('Este tipo de formato no es permitido en la aplicacion, por favor vuelve a intentar con otro tipo de extencion')
            return false
        }
    }

    const formData = new FormData();
    formData.append('descripcion', descripcion)
    formData.append('image', image[0])

    // fetch post
    fetch('/data',{
        method:'POST',
        body: formData
    })
    .then(res => res.json())
    .then(datos => {
        uiAddPost.addPost()
    })
    document.getElementById('preView-img').innerHTML =""
    form.reset()
})

class DataPost {
    //fetch for get all posts
    async getPost(){
        let response = await fetch('/data')
        let res = await response.json()
        return res
    }
}

class UiAddPost{
    //recorer el arreglo de los posts
    async addPost(){
        let datos = await postData.getPost()

        div.innerHTML = '';
        for (var i = datos.publicacion.length - 1; i >= 0; i--) {
            const comments = datos.comenta;
            let array = comments.filter(element => {
                return element.post === datos.publicacion[i]._id
            })

            moment.locale('es-do')
            let saved = datos.user.postsSaved.includes(datos.publicacion[i]._id);
            let likes = datos.publicacion[i].like.includes(idUser)
            const times = new Date(datos.publicacion[i].timesAgo);
            let timeago = moment(times, 'YYYYMMDD','es').fromNow()

            if(datos.publicacion[i].fotoPost != undefined){
                var ext = datos.publicacion[i].fotoPost.split('.',2)[1].toLowerCase()
            }
    
            div.innerHTML += `<div class="publicacion">
                <div class="headerPost">
                    <div class="conF">
                        <div class="foto_u_p">
                            <img class="imgP" src="${datos.publicacion[i].user.userFoto? datos.publicacion[i].user.userFoto : '../userIcon.jpg'}" alt="">
                        </div>
                        <div class="">
                            ${(datos.publicacion[i].user._id == idUser)?
                                `<a class="aNameUser" href="/my_perfil"><h2 class="u_n_p">${datos.publicacion[i].user.nombre}</h2></a>`
                                : `<a class="aNameUser" href="/perfil/${datos.publicacion[i].user._id}"><h2 class="u_n_p">${datos.publicacion[i].user.nombre}</h2></a>`
                            }
                        </div>
                    </div>
                    <div class="div_E_D">
                        ${(datos.publicacion[i].user._id == idUser)? `
                            <a  href="#"  data-eli="${datos.publicacion[i]._id}" id="btnEli" class="eliminar" >
                            <i class="material-icons">delete</i> Eliminar
                            </a>
                        `: ''}
                        <p>${timeago}</p>
                    </div>
                </div>
                <div class="postTitulo">
                    <div class="title">
                        <div>
                            <p class="m">${datos.publicacion[i].descripcion}</p>
                        </div>  
                    </div>
                    <div class="images" ${datos.publicacion[i].fotoPost == undefined ? ' style="display: none"' : ''}>
                        ${ 
                            ( ext === "mp4")
                            ? `<video controls 
                                    class="img_p" 
                                    src="${datos.publicacion[i].fotoPost}"
                                </video>`
                            :`<img class="img_p" src="${datos.publicacion[i].fotoPost}" alt=""></img>`
                        }
                    </div>
                </div>
                <div class="count">
                    <p>Me gusta: ${datos.publicacion[i].like.length}</p>
                    <p>Comentarios: ${datos.publicacion[i].coment.length}</p>
                </div>
                <div class="l_c">
                    <div class="like">
                        ${(likes == true)?
                            `<a href="#" data-my_id="${idUser}" data-id="${datos.publicacion[i]._id}" id="btnId" class="like a_l_c verde" >
                                <i class="material-icons">favorite</i> Me gusta 
                            </a>` :            
                            `<a href="#" data-my_id="${idUser}" data-id="${datos.publicacion[i]._id}" id="btnId" class="like a_l_c" >
                                <i class="material-icons">favorite</i> Me gusta
                            </a>`
                        }
                    </div>
                    <div>
                        <a href="/comentar/${datos.publicacion[i]._id}" class="a_l_c">
                            <i class="material-icons">comment</i> Comentar
                        </a>
                    </div>
                    <div ${(datos.publicacion[i].fotoPost == undefined)? ' style="display: none"' : ''}>
                        ${
                            (saved==true) ?
                            `<a class="a_l_c guardar verde" data-i="${[i]}" data-id="${datos.publicacion[i]._id}" href="">
                                <i class="material-icons">bookmark</i> Guardar
                            </a>` : 
                            `<a class="a_l_c guardar" data-i="${[i]}" data-id="${datos.publicacion[i]._id}" href="">
                                <i class="material-icons">bookmark</i> Guardar
                            </a>`
                        }
                    </div>
                </div>
                <div class="coment" id="com">
                    ${array.map(element => {
                        return `
                            <div class="box_cmt">
                                <div class="cm">
                                    <div class="cm_">
                                        <div class="hjk">
                                            <div class="c_user_foto">
                                                <img src="${element.user.userFoto? element.user.userFoto : '../userIcon.jpg'}" alt="">
                                            </div> 
                                        </div>
                                        <span>
                                            <a class="c_a_user" href="${(element.user._id == idUser)? '/my_perfil' : `/perfil/${element.user._id}`}">
                                                <b>${element.user.nombre}</b> 
                                            </a>
                                            ${element.comentario}
                                        </span>
                                    </div>
                                </div>
                            </div>`
                    })}
                </div>
            </div>`   
        }
    }

    // funcion para cambiar el color del boton 'Guardar' cuando un post esta guardado
    changeColor(data, e){
        if(data==false){
            e.target.style.color='rgb(2, 170, 2)'
        }else{
            e.target.style.color='rgb(13, 13, 245)'
        }
    }

    //funcion para cambiar el estilo del boton 'Like'
    changeColorLike(data, e){
        if(data.v_f == false){
            e.target.style.color='rgb(2, 170, 2)'
        }else{
            e.target.style.color='rgb(13, 13, 245)'
        }
    }
}

//DOM
div.addEventListener('click', (e) => {
    //eliminar
    if(e.target.classList.contains('eliminar')){
        e.preventDefault()
        if(confirm('Deseas eliminar esa publicacion')){
            const id = e.target.dataset.eli;

            fetch('/eliminar/'+id, {
                method:'GET'
            }) 
            .then(res => res.json())
            .then(data => {
                uiAddPost.addPost()
            })
        }
    }

    //like
   if(e.target.classList.contains('like') ){  
        e.preventDefault()
        const id = e.target.dataset.id;
        const my_id = e.target.dataset.my_id;

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
            uiAddPost.changeColorLike(data, e)
            uiAddPost.addPost()
        })
    }

    //guardar
    if(e.target.classList.contains('guardar') ){  
        e.preventDefault()
        
        const id = e.target.dataset.id;
        const i = e.target.dataset.i;
        
        fetch('/savedPost/'+ id, {
            method:'POST',
            body: JSON.stringify(id) 
        })
        .then(res => res.json())
        .then(data => {
            uiAddPost.changeColor(data, e)
            uiAddPost.addPost()
        })
    }
})

const postData = new DataPost();
const uiAddPost = new UiAddPost();

