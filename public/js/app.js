// var texto = document.getElementById('texto');
// var btn = document.getElementById('btn');
let exploreHTML = document.getElementById('exploreData');

import AllPost from './RequestData.js'

const showAllPost = async()=>{
    const allPost = await AllPost.getAllPost()
    // console.log(allPost.publicacion); 

    //sort to  get the top post
    const sortPost = allPost.publicacion.sort((a, b)=>{
        if(a.like.length > b.like.length || a.coment.length > b.coment.length){
            return -1
        }
        if(a.like.length < b.like.length || a.coment.length < b.coment.length){
            return 1
        }
        return 0
    })

    exploreHTML.innerHTML = ""
    sortPost.forEach((post, i) => {

        exploreHTML.innerHTML +=`
            <div class="each_post">
                <div class="post">
                    <div class="img" href="">
                        <img src="${post.fotoPost}" class="imgPost view" data-id="${post._id}" data-place="explore" alt="">
                    </div>
                </div>
            </div>
        `

    });
}


const showAllUsers = async()=>{

}

showAllPost()
