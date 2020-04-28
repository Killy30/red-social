const container = document.getElementById('container')
const divComments = document.getElementById('comments')
const formComment = document.getElementById('formComment')
const id = container.dataset.id;

class Datas {
    getData(){
        fetch('/postComment/'+id)
            .then(res => res.json())
            .then(data => {
                console.log(data, id);
                add.addPost(data)
            })
    }
}

class UiPost {
    addPost(data){
        container.innerHTML = `<div class="post">
            <div class="headerPost">
                <h2>${data.post.user.nombre}</h2>
            </div>
            <div class="postTitulo">
                <div class="p">
                    <p>${data.post.descripcion}</p>
                </div>
            </div> 
            <div class="divImg">
                <img src="${data.post.fotoPost}" alt="">
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
}
const getPost = new Datas()
const add = new UiPost()
getPost.getData()

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
        getPost.getData()
    })

    formComment.reset();
})