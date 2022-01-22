import Data from './RequestData.js'

const box = document.querySelector('.box')

class Post{
//data-lightbox="example-set"
    async addPost(){
        let my_posts = await Data.getMyPost()
        let postsArray = my_posts.posts;
        // let posts = my_posts.posts;
       

        const posts = postsArray.sort(function(a,b){
            return new Date(b.timesAgo).getTime() - new Date(a.timesAgo).getTime();
        });

        console.log(posts);

        box.innerHTML = ''
        for(let c = 0; c < posts.length; c++){

            if(posts[c].fotoPost){ 
                let ext = posts[c].fotoPost.split('.',2)[1].toLowerCase()
                box.innerHTML += `<div class="box_publicacion">
                    <div class="img_post">
                        <div class="post_menu menu_x584" data-i="${c}">
                            <span class="material-icons-outlined menu_x584" data-i="${c}">more_horiz</span>
                        </div>
                        <div class="body_post_menu" >
                            <a href="#" data-id="${posts[c]._id}" id="btnEli" class="eliminar">Eliminar</a>
                        </div>
                        <div class="box_img" data-title="${posts[c].descripcion}" id="card_images">
                            ${(ext === 'mp4')?
                                `<video controls class="imgPost" src="${posts[c].fotoPost}"></video>`:
                                `<img class="imgPost view" data-id="${posts[c]._id}" data-place="myprofile" data-img_="${posts[c].fotoPost}" src="${posts[c].fotoPost}" alt="">`
                            }
                        </div>
                    <div>
                </div>`
            } 
        }   
    }
}

let dataPosts = new Post()
dataPosts.addPost()

box.addEventListener('click', e =>{

    if(e.target.classList.contains('menu_x584')){
        let i = e.target.dataset.i
        let j = parseInt(i)

        let p
        let body_post_menu = document.querySelectorAll('.body_post_menu')

        body_post_menu.forEach((element, x) =>{
            if(element.classList.contains('display') == true){p = x}
        })

        if(p == undefined){
            return body_post_menu[i].classList.toggle('display')
        }else if(p !== j){
            body_post_menu[p].classList.remove('display')
            body_post_menu[i].classList.add('display')
            
        }else if(p == j){
            return body_post_menu[i].classList.toggle('display')
        }
    }

    if(e.target.classList.contains('eliminar')){
        e.preventDefault()
        if(confirm('Deseas eliminar esa publicacion')){
            const id = e.target.dataset.id;

            fetch('/eliminar/'+id, {
                method:'GET'
            }) 
            .then(res => res.json())
            .then(data => {
                dataPosts.addPost()
            })
        }
    }
})