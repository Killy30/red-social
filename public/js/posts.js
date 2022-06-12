const all_posts = document.getElementById('all_posts');
const btnSbmit = document.getElementById('btnSbmit');
const btn_text = document.querySelector('.white_something')

const idUser = all_posts.dataset.id; 

document.addEventListener('DOMContentLoaded', () => {
    part_array()
    getPost()
})

const all_data = async() =>{
    let response = await fetch('/data')
    let res = await response.json()
    return res
}

//fetch for get all posts
const getPost = async() =>{
    try{
        all_posts.innerHTML = '<p>cargando...</p>'
        let datos = await all_data()
        if(datos) return addPost()
    }catch (error){
        console.log(error);
    }
}


btnSbmit.addEventListener('click', async(e)=> {
    e.preventDefault();
    const descripcion = document.getElementById('descripcion').value;
    const image = document.getElementById('image').files;
    
    //validar si los campos estan vacios 
    if(descripcion.trim() ==="" && image.length === 0) return false;

    //validar si la extencion del archivo es permitida
    if(image.length !== 0){
        let ext_ = image[0].name.split('.', 2)[1].toLowerCase()

        if(!(/(jpg|jpeg|png|gif)$/i).test(ext_)){
            alert('Este tipo de formato no es permitido en la aplicacion, por favor vuelve a intentar con otro tipo de alchivo')
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
        addPost()
    })
    document.getElementById('preView-img').innerHTML =""
    document.querySelector('.box_textarea_contains').style.display = 'none'
    document.querySelector('.text_click').style.display = 'block'
    form.reset()
})

let loading_posts = []
let begin_index = 0
let end_index = 5


const part_array = async() =>{
    console.log(begin_index, end_index);

    let datas = await all_data()
    console.log(datas);
    let part = datas.publicacion.slice(begin_index, end_index)

    if(begin_index < datas.publicacion.length){
        begin_index = begin_index + 5
        end_index = end_index + 5
        loading_posts.push(...part)
        console.log(loading_posts);
        console.log(begin_index, end_index);
    }
    // return loading_posts
}


//show all post 
const addPost = async() => {

    let datos = await all_data()
    let datas = datos.publicacion

    all_posts.innerHTML = '';

    for (var i = datas.length - 1; i >= 0; i--) {
        const comments = datos.comenta;

        let array = comments.filter(element => {
            return element.post === datas[i]._id
        })

        moment.locale('es-do')
        let saved = datos.user.postsSaved.includes(datas[i]._id);
        let likes = datas[i].like.includes(idUser)
        const times = new Date(datas[i].timesAgo);
        let timeago = moment(times, 'YYYYMMDD','es').fromNow()

        if(datas[i].fotoPost != undefined){
            var ext = datas[i].fotoPost.split('.',2)[1].toLowerCase()
        }
        if(datos.user.linked.includes(datas[i].user._id) || datas[i].user._id === idUser){
            
            all_posts.innerHTML += `<div class="publicacion" >
            
                <div class="postTitulo">
                    
                    <div class="images" ${datas[i].fotoPost == undefined ? ' style="display: none"' : ''}>
                        ${ 
                            ( ext === "mp4")
                            ? `<video controls 
                                    class="img_p" 
                                    src="${datas[i].fotoPost}"
                                </video>`
                            :`<img class="img_p" src="${datas[i].fotoPost}" loading="lazy" alt=""></img>`
                        }
                    </div>
                </div>
                <div class="headerPost">
                    <div class="conF">
                        <div class="foto_u_p">
                            ${datas[i].user.userFoto?
                                `<img class="imgP" src="${datas[i].user.userFoto}" alt="">`:
                                '<span class="material-icons-outlined">person_outline</span>'
                            }
                            
                        </div>
                        <div class="">
                            <a class="aNameUser" href="${(datas[i].user._id == idUser)?'/my_perfil':`/perfil/${datas[i].user._id}`}">
                                <h2 class="u_n_p">${datas[i].user.nombre}</h2>
                            </a>
                            
                        </div>
                        <p class="timeago">${timeago}</p>
                    </div>
                    <div class="div_E_D">
                        ${(datas[i].user._id == idUser)? `
                            <a  href="#"  data-eli="${datas[i]._id}" id="btnEli" class="eliminar" >
                                <span class="material-icons-outlined eliminar" data-eli="${datas[i]._id}">delete</span>
                            </a>
                        `: ''}
                    </div>
                </div>
                <div class="bodyPost">
                
                    <div class="title">
                        <div>
                            <p class="m">${datas[i].descripcion.replace(/\n/g, '<br>')}</p>
                        </div>  
                    </div>
                    <div class="l_c">
                        <div class="box_group_icons">
                            <div class="like" data-my_id="${idUser}" data-id="${datas[i]._id}">
                                <a href="#" data-my_id="${idUser}" data-id="${datas[i]._id}" id="btnId" class="like a_l_c ${(likes == true)?'red':''}" >         
                                    <span class="material-icons-outlined like" data-my_id="${idUser}" data-id="${datas[i]._id}" >
                                        favorite_border 
                                    </span>
                                    <span class="count_xzr25">${datas[i].like.length}</span>
                                </a>
                            </div>
                            <div class="xp25">
                                <a href="/comentar/${datas[i]._id}" class="a_l_c">
                                    <span class="material-icons-outlined">mode_comment</span> 
                                    <span class="count_xzr25">${datas[i].coment.length}</span>
                                </a>
                            </div>
                            <div class="xp25" ${(datas[i].fotoPost == undefined)? ' style="display: none"' : ''}>
                                <a class="a_l_c guardar ${(saved == true)?'red':''}" data-i="${[i]}" data-id="${datas[i]._id}" href="">
                                    <span class="material-icons-outlined guardar" data-i="${[i]}" data-id="${datas[i]._id}">
                                        bookmark_border
                                    </span> 
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="coment" id="com">
                        ${array.map((element, i) => {
                            if(i<=1){
                                return `
                                    <div class="box_cmt">
                                        <div class="cm">
                                            <div class="cm_">
                                                <div class="hjk">
                                                    <div class="c_user_foto">
                                                        ${element.user.userFoto?
                                                            `<img src="${element.user.userFoto}" alt="">`:
                                                            '<span class="material-icons-outlined icon_comment">person_outline</span>'
                                                        }
                                                    </div> 
                                                </div>
                                                <span class="coment_box">
                                                    <a class="c_a_user" href="${(element.user._id == idUser)? '/my_perfil' : `/perfil/${element.user._id}`}">
                                                        <b>${element.user.nombre}</b> 
                                                    </a>
                                                    ${element.comentario}
                                                </span>
                                            </div>
                                        </div>
                                    </div>`
                            }
                        }).join('')}
                    </div>
                </div>
            </div>`   
        }
    }

    const post_list = document.querySelectorAll('.publicacion')
    // setObserver(post_list[post_list.length-1]);
}


// funcion para cambiar el color del boton 'Guardar' cuando un post esta guardado
const changeColor = (data, e)=>{
    if(data==false){
        e.target.style.color='rgb(182, 0, 0)'
    }else{
        e.target.style.color='rgb(71, 71, 71)'
    }
}

//funcion para cambiar el estilo del boton 'Like'
const changeColorLike = (data, e)=>{
    if(data.v_f == false){
        e.target.style.color='rgb(182, 0, 0)'
    }else{
        e.target.style.color='rgb(71, 71, 71)' 
    }
}    


//DOM
document.addEventListener('click', (e) => {
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
                addPost()
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
            changeColorLike(data, e)
            addPost()
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
            changeColor(data, e)
            addPost()
        })
    }

    if(e.target.classList.contains('text_click')){
        e.preventDefault()
        console.log('kkkk');
        document.querySelector('.text_click').style.display = 'none'
        document.querySelector('.box_textarea_contains').style.display = 'block'
    }

    if(e.target.classList.contains('btn_close_textarea')){
        e.preventDefault()
        document.querySelector('.text_click').style.display = 'block'
        document.querySelector('.box_textarea_contains').style.display = 'none'
    }
})


const callback = (entries) =>{
    entries.forEach(element => {
        if(element.isIntersecting){
            console.log(element.target);
            part_array()
            addPost()
        }
    });
}

const setObserver = (post) => {
    const options = {
        // threshold: 0.5
    }

    const observer = new IntersectionObserver(callback, options)

    observer.observe(post)
}






