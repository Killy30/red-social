// const container = document.getElementById('container')
const contain = document.querySelector('.postSave')



contain.addEventListener('click', e => {
    // view img
    if(e.target.classList.contains('view') ){  
        e.preventDefault()
        let img = e.target.dataset.img_
        let h = innerHeight;
        let w = innerWidth;
        document.getElementById('off').style.display = 'none'
        const view_img = document.getElementById('view_img')
        view_img.style.display = "flex"
        view_img.style.width = w+'px'
        view_img.style.height = h+'px'
    
        view_img.innerHTML = `
            <div class="dg_img">
                <img class="view_show" src="${img}" alt="">
                <button class="btn_x" id="btn_x">X</button>
            </div>
        `

    }

   
})

window.addEventListener('click', e =>{
    if(e.target.classList.contains('btn_x') ){
        e.preventDefault()
        view_img.style.display = "none"
        document.getElementById('off').style.display = 'flex'
    } 
})
