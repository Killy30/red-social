var texto = document.getElementById('texto');
var resul = document.getElementById('resul');
var btn = document.getElementById('btn');

function buscando(e){
    var text = texto.value.toLowerCase();    
    resul.innerHTML = '';

    fetch('/usuarios')
        .then(users => users.json())
        .then(users => {
            var usuarios = users.users
            
            for(let u of usuarios){
                var nombre = u.nombre.toLowerCase()
               
                if(nombre.indexOf(text) !== -1){
                    if(users.user._id !== u._id){
                        resul.innerHTML += `
                        <div class="users">
                            <a class="user_a" href="/perfil/${u._id}">
                                <div class="divImg">
                                    <img class="img" src="${(u.userFoto !== undefined)?`${u.userFoto}`: '../userIcon.jpg'}">
                                </div>
                                <p>${u.nombre}</p>
                            </a>
                        </div>`
                        
                    }
                }
            }
            if(resul.innerHTML === ''){
                resul.innerHTML += `<div class=""><p>Usuario no encontrado...</p></div>`
            }
        })
}

btn.addEventListener('click', buscando);
texto.addEventListener('keyup', buscando);
buscando();