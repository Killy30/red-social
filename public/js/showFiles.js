
( ()=>{
    var file = document.getElementById('image');
    
    file.addEventListener('change', (e)=> {
        var imgId = Math.floor(Math.random() * 30000) + '_' + Date.now();
        createImages(file, imgId)
    })

    function createImages(file, imgId){
        var divImg = document.createElement('div');
        divImg.classList.add('divImg', imgId);
        divImg.dataset.id = imgId;
        document.getElementById('preView-img').innerHTML =""
        divImg.setAttribute('style', `background-image: url(${URL.createObjectURL( file.files[0])})`);
        document.getElementById('preView-img').appendChild(divImg)
    }
})()
