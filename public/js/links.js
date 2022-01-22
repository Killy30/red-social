
const linksData = {}

function changeColor(data, e){
    if(data==false){
        e.target.style.color='rgb(2, 170, 2)'
    }else{
        e.target.style.color='rgb(13, 13, 245)'
    }
}

//funcion para cambiar el estilo del boton 'Like'
function changeColorLike(data, e){
    console.log(e.target.dataset.likes);
    if(data.v_f == false){
        e.target.style.color='rgb(2, 170, 2)'
    }else{
        e.target.style.color='rgb(13, 13, 245)'
    }
}

linksData.follow_user = (e)=>{
    // e.preventDefault()
    const btn_links = document.getElementById('btn_follow')
    const id_user = e.target.dataset.id
 
    fetch('/follow',{
        headers:{'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({_id:id_user})
    })
    .then(res => res.json())
    .then(data =>{
        if(data.res){
            btn_links.innerText = "Seguir"
        }else{
            btn_links.innerText = "Siguiendo"
        }
    })

}

//like
linksData.likes = async(e)=>{
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

//saved
linksData.savedImg = async(e)=>{
    e.preventDefault()
    const id = e.target.dataset.id;
    
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


export default linksData