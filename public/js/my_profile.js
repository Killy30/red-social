const box = document.querySelector('.box')

class Post{
    async getPost(){
        let req = await fetch('/my_posts')
        let res = await req.json()
        return res
    }

    async addPost(){
        let user_ = await this.getPost()
        let user = user_.user;
        box.innerHTML = ''
        for(let c = user.posts.length-1; c >=0; c--){
            if(user.posts[c].fotoPost){ 
                let ext = user.posts[c].fotoPost.split('.',2)[1].toLowerCase()
                box.innerHTML += `<div class="box_publicacion">
                    <a href="#"  data-id="${user.posts[c]._id}" id="btnEli" class="eliminar">Eliminar</a>
                    <div class="box_img">
                        ${(ext === 'mp4')?
                            `<video controls class="imgPost" src="${user.posts[c].fotoPost}"></video>`:
                            `<img class="imgPost view" data-img_="${user.posts[c].fotoPost}" src="${user.posts[c].fotoPost}" alt="">`
                        }
                    </div>
                </div>`
            } 
        }   
    }
}

let dataPosts = new Post()
dataPosts.addPost()

box.addEventListener('click', e =>{
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