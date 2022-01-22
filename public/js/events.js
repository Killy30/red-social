
import linksData from './links.js'

window.addEventListener('click', e =>{
 
    if(e.target.classList.contains('follow_btn')){
        e.preventDefault()
        console.log('btn');
        linksData.follow_user(e)
    }
    if(e.target.classList.contains('like')){
        linksData.likes(e)
    }
    if(e.target.classList.contains('guardar') ){
        linksData.savedImg(e)
    }  
})