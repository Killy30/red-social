const div = document.getElementById('div');
const btnSbmit = document.getElementById('btnSbmit');
const divComments = document.createElement('div');

const idUser = div.dataset.id; 
const format = div.dataset.date; 

document.addEventListener('DOMContentLoaded', () => {
    postData.getPost()
})

btnSbmit.addEventListener('click', async(e)=> {
    e.preventDefault();
    const descripcion = document.getElementById('descripcion').value;
    const image = document.getElementById('image').files;
    
    if(descripcion.trim() ==="" && image.length === 0) return false;

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
        postData.getPost()
    })
    document.getElementById('preView-img').innerHTML =""
    form.reset()
})

class DataPost {
    //fetch get post
    getPost(){
        fetch('/data')
        .then(res => res.json())
        .then(datos => {
            uiAddPost.addPost(datos)
            console.log(datos);
               
        })
    }

    //fetch get comment
    getComments(){
        fetch('/comments')
        .then(res => res.json())
        .then(comments => {
            
        })
    }
}

class UiAddPost{
    //post
    addPost(datos){
        div.innerHTML = '';
        for (var i = datos.publicacion.length - 1; i >= 0; i--) {
            const comments = datos.comenta;
            let array = comments.filter(element => {
                return element.post === datos.publicacion[i]._id
            })
            let saved = datos.user.postsSaved.includes(datos.publicacion[i]._id);
            if(datos.publicacion[i].fotoPost){
                
                datos.publicacion[i].fotoPost.split('.',2)
                console.log(datos.publicacion[i].fotoPost.split('.',2)[1]);
                
            }
            
            const times = new Date(datos.publicacion[i].timesAgo);
            div.innerHTML += `<div class="publicacion">
                <div class="headerPost">
                    <div class="conF">
                        <div class="foto_u_p">
                            <img class="imgP" src="${datos.publicacion[i].user.userFoto}" alt="">
                        </div>
                        <div class="">
                            <a class="aNameUser" href="/perfil/${datos.publicacion[i].user._id}"><h2 class="u_n_p">${datos.publicacion[i].user.nombre}</h2></a>
                        </div>
                    </div>
                    <div class="div_E_D">
                        ${(datos.publicacion[i].user._id == idUser)? `
                            <a  href="#"  data-eli="${datos.publicacion[i]._id}" id="btnEli" class="eliminar" >
                            Eliminar
                            </a>
                        `: ''}
                        <p>${times.getDay()}/${times.getMonth()}/${times.getFullYear()}</p>
                    </div>
                </div>
                <div class="postTitulo">
                    <div class="title">
                        <div>
                            <p class="m">${datos.publicacion[i].descripcion}</p>
                        </div>  
                    </div>
                    <div class="images">
                        ${ 
                            (datos.publicacion[i].fotoPost != undefined && datos.publicacion[i].fotoPost.split('.',2)[1] === "mp4")
                            ? `<video controls 
                                    
                                    class="img_p" 
                                    src="${datos.publicacion[i].fotoPost}"
                                </video>`
                            :`<img class="img_p" src="${datos.publicacion[i].fotoPost}" alt=""></img>`
                        }
                    </div>
                </div>
                <div class="l_c">
                    <div class="like">
                        <a href="#" data-id="${datos.publicacion[i]._id}" id="btnId" class="like a_l_c" >
                            Like: ${datos.publicacion[i].like}
                        </a>            
                    </div>
                    <div>
                        <a class="a_l_c" href="/coment/${datos.publicacion[i]._id}">
                            Comentar: ${datos.publicacion[i].coment.length}
                        </a>
                    </div>
                    <div>
                        ${(saved==true) ?
                            `<a class="a_l_c guardar verde" id="color" data-i="${[i]}" data-id="${datos.publicacion[i]._id}" href="">
                                Guardar
                            </a>` : 
                            `<a class="a_l_c guardar" id="color" data-i="${[i]}" data-id="${datos.publicacion[i]._id}" href="">
                                Guardar
                            </a>`
                        }
                    </div>
                </div>
                <div class="coment" id="com">
                    ${array.map(element => {
                        return `
                            <div class="cm">
                                <b>${element.user.nombre}</b> 
                                <span>${element.comentario}</span>
                            </div>`
                    })}
                </div>
            </div>`   
        }
    }

    changeColor(data, e){
        console.log(data);
        if(data==false){
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
            console.log(e.target.dataset.eli);
            const id = e.target.dataset.eli;

            fetch('/eliminar/'+id, {
                method:'GET'
            }) 
            .then(res => res.json())
            .then(data => {
                console.log(data);
                postData.getPost()
            })
        }
    }

    //like
   if(e.target.classList.contains('like') ){  
        e.preventDefault()
        const i = e.target.dataset.nu
        const id = e.target.dataset.id;
      
        fetch('/like/'+ id, {
            method:'POST',
            body: JSON.stringify(id) 
        })
        .then(res => res.json())
        .then(data => {
            btnId.innerHTML = 'Like: ' + data.likes 
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
            console.log(data, i, id);
            uiAddPost.changeColor(data, e)
        })
    }
})

const postData = new DataPost();
const uiAddPost = new UiAddPost();





