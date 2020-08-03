const form = document.getElementById('form')
const box = document.getElementById('boxF')
const btn = document.getElementById('btn')

let h = innerHeight;
document.querySelector('.content').style.height = h+'px'


form.addEventListener('submit', (e) => {
    e.preventDefault()

    let img = document.getElementById('image').files;
    
    if(img.length === 0) return false;
    const formData = new FormData();
    formData.append('image', img[0])

    fetch('/cambiar_foto_perfil',{
        method:'POST',
        body: formData,
    })
    .then(res => res.json())
    .then(datos => {
        getData.addImg()
    })
    getData.addImg()
    document.getElementById('preView-img').innerHTML=''
    form.reset()
})


class Data {
    async getUser(){
        let response = await fetch('/users')
        let res = await response.json()
        return res
    }

    async addImg(){
        let res = await this.getUser()
        let user = res.myUser
        box.innerHTML = `
            <img class="imgU" src="${!user.userFoto ? '../userIcon.jpg': user.userFoto}" >
        `
    }
}


let getData = new Data()
getData.addImg()

