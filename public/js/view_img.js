// const container = document.getElementById('container')
import Data from './RequestData.js'
import follow_user from './links.js'

const allPosts = await Data.getAllPost()


//view img
let viewImage = async(post)=>{

    const comments = allPosts.comenta;
    const postComment = comments.filter(element => {
        return element.post === post._id
    })
    moment.locale('es-do')
    const times = new Date(post.timesAgo);
    let timeago = moment(times, 'YYYYMMDD','es').fromNow()
 
    let h = innerHeight;
    let w = innerWidth;

    const view_img = document.getElementById('view_img')
    let my_id = view_img.dataset.my_id
    let verify = view_img.dataset.verify
    view_img.style.display = "flex"

    view_img.innerHTML = `
        <div class="dg_img">
            <div class="view_mobil_display">
                <img class="view_show" src="${post.fotoPost}" alt="">
            </div>
            <div class="card_view">
                <div class="card_view_img">
                    <img class="view_show" src="${post.fotoPost}" alt="">
                </div>
                <div class="card_view_info">
                    <div class="card_view_header">
                        <div class="card_view_name">
                            <div class="view_profile_img">
                                <img src="${post.user.userFoto}" alt="">
                            </div>
                            <div class="view_name">
                                <a href="${post.user._id == my_id?'/my_perfil':`/perfil/${post.user._id}`}">${post.user.nombre}</a>
                            </div>
                        </div>
                        <div class="view_follow">
                            ${post.user._id !== my_id && verify == undefined?
                                ` <a href="#" class="view_btn_follow follow_btn" data-id="${post.user._id}" id="btn_follow">
                                      ${post.user.followers.includes(my_id)?'Siguiendo':'Seguir'}
                                  </a>`
                                :''
                            }
                        </div>
                        
                    </div>
                    <div class="card_view_body">
                        <div class="description">
                            ${post.descripcion.replace(/\n/g, '<br>')}
                        </div>
                        <div class="card_comment">
                            ${postComment.map((element, i) => {
                                return `
                                    <div class="view_card_comment">
                                        <div class="view_profile">
                                            <div class="view_img_profile">
                                                ${element.user.userFoto?
                                                    `<img src="${element.user.userFoto}" alt="">`:
                                                    '<span class="material-icons-outlined icon_comment">person_outline</span>'
                                                }
                                            </div> 
                                        </div>
                                        <span class="view_comment_text">
                                            <a class="view_user_name" href="/perfil/${element.user._id}">
                                                <b>${element.user.nombre}</b> 
                                            </a>
                                            ${element.comentario}
                                        </span>
                                    </div>
                                `
                            }).join('')}
                        </div>
                    </div>
                    <div class="view_card_fooder">
                        <div class="view_likes">
                            <div class="like" data-my_id="" data-id="">
                                <a href="#" data-my_id="" data-id="" id="btnId" class="like view_element " >         
                                    <span class="material-icons-outlined like" data-my_id="" data-id="" >
                                        favorite_border 
                                    </span>
                                    
                                </a>
                            </div>
                            <div>
                                <a href="" class="view_element">
                                    <span class="material-icons-outlined">comment</span> 
                            
                                </a>
                            </div>
                            <div>
                                <a class="view_element guardar" data-i="" data-id="" href="">
                                    <span class="material-icons-outlined guardar" data-i="" data-id="">
                                        bookmark_border
                                    </span> 
                                </a>
                            </div>
                        </div>
                        <div class="view_time_ago">
                            <p>${timeago}</p>
                        </div>
                        <div class="view_comment_form">
                            <div class="view_form">
                                <input type="text" class="view_input" placeholder="Agrega un comentario" name="" id="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn_x btn_close" id="btn_close">
                <span class="material-icons-outlined btn_close">close</span>
            </button>
            <button type="button" class="btn_x btn_previous" id="btn_previous">
                <span class="material-icons-outlined btn_previous">arrow_back_ios</span>
            </button>
            <button type="button" class="btn_x btn_next" id="btn_next">
                <span class="material-icons-outlined btn_next">arrow_forward_ios</span>
            </button>
        </div>
    `   
}

const arrayImages = document.querySelectorAll('.imgPost')

let indexImg = 0
let lengthAllImg = 0;


//get the image that you clicked
const selectImg = (e)=>{
    if(e.target.classList.contains('view') ){ 
        let id = e.target.dataset.id;
        indexImg = Array.from(arrayImages).indexOf(e.target)
        lengthAllImg = Array.from(arrayImages).length -1
        getIndex(id)
    }
}

//get index of the arrays images
const getIndex = (id)=>{
    const post = allPosts.publicacion.find(img =>{
        return img._id == id
    })

    viewImage(post)

    if(indexImg == lengthAllImg){
        document.getElementById('btn_next').style.display = "none"
    }
    if(indexImg == 0){
        document.getElementById('btn_previous').style.display = "none"
    }
    
}

//view next image
const nextImage = () =>{
    if(indexImg < lengthAllImg){
        indexImg++;
        let img = Array.from(arrayImages)[indexImg]
        if(indexImg == lengthAllImg){
            document.getElementById('btn_next').style.display = "none"
            getIndex(img.dataset.id)
        }else{
            getIndex(img.dataset.id)

        }

    }
}

//view previous image
const previousImage = ()=>{
    if(indexImg > 0){
        indexImg--;
        let img = Array.from(arrayImages)[indexImg]
        if(indexImg == 0){
            document.getElementById('btn_previous').style.display = "none"
            getIndex(img.dataset.id)
        }else{
            getIndex(img.dataset.id)

        }
    }
}


arrayImages.forEach(image =>{
    image.addEventListener('click', selectImg)
})


window.addEventListener('click', e =>{
    if(e.target.classList.contains('btn_close') ){
        e.preventDefault()
        view_img.style.display = "none"
    } 
    if(e.target.classList.contains('btn_previous') ){
        e.preventDefault()
        previousImage()
    }
    if(e.target.classList.contains('btn_next') ){
        e.preventDefault()
        nextImage()
    }
})
