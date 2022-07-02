
const view_edit_profile = document.querySelector('.view_edit_profile')
const open_profile_img = document.querySelector('.open_profile_img')
const close_btn = document.querySelector('.close_btn')
const preView_img = document.querySelector('.preView-img')

document.addEventListener('DOMContentLoaded', () => {
    let h = innerHeight;
    document.querySelector('.view_edit_profile').style.height = h+'px'
})

close_btn.addEventListener('click', async(e) =>{
    e.preventDefault()
    view_edit_profile.classList.remove('open')
    
})

open_profile_img.addEventListener('click', async(e) =>{
    e.preventDefault()
    let divImg = document.createElement('img');
    divImg.classList.add('divImg');
    let response = await fetch('/users')
    let res = await response.json()
    
    let user = res.myUser
    preView_img.innerHTML=''
    divImg.src = user.userFoto
    preView_img.appendChild(divImg)
    view_edit_profile.classList.add('open')
})

var file = document.getElementById('image');

file.addEventListener('change', (e)=> {
    var imgId = Math.floor(Math.random() * 30000) + '_' + Date.now();
    createImages(file, imgId)
})

function createImages(file, imgId){
    var divImg = document.createElement('img');
    divImg.classList.add('divImg', imgId);
    divImg.dataset.id = imgId;
    preView_img.innerHTML =""
    divImg.src = URL.createObjectURL( file.files[0])
    preView_img.appendChild(divImg)
}


