const input_search = document.getElementById('input_search')
let showResult = document.getElementById('show-result')
const menu_bar = document.querySelector('.menu_bar')
const menu = document.querySelector('.menu_items')

const getUser = async()=>{
    let req = await fetch('/usuarios')
    let res = await req.json()
    return res
}

const searchUser = async()=>{
    let users = await getUser()
    
    showResult.innerHTML = ''

    let _users = users.users.filter(user => user._id !== users.user._id )

    let text = input_search.value.toLowerCase()
    for(let user of _users){
        
        let name = user.nombre.toLowerCase()

        if(name.indexOf(text) !== -1){
            showResult.innerHTML += `
                <a href="/perfil/${user._id}" class="box_user_search">
                    <div class="search_user">
                        <div class="img_profile_user">
                            <img src="${user.userFoto ? user.userFoto:''}" alt="">
                        </div>
                        <div class="name_user_search">
                            <p>${user.nombre}</p>
                        </div>
                    </div>
                </a>
            `
        }
        
    }
    if(showResult.innerHTML == ''){
        showResult.innerHTML += `
            <div href="" class="box_user_search">
                <div class="search_user">
                    <div class="name_user">
                        <p>Usuario no encontrado</p>
                    </div>
                </div>
            </div>
        `
    }

}


input_search.addEventListener('keyup', searchUser)
input_search.addEventListener('click', e=>{
    showResult.classList.remove('hide')
})

document.getElementsByTagName('body')[0].addEventListener('click', e =>{
    if(!e.target.classList.contains('x_8397')){
        showResult.classList.add('hide')
    }
})

menu_bar.addEventListener('click', e =>{
    e.preventDefault()
    menu.classList.toggle('menu_vidible')

})
