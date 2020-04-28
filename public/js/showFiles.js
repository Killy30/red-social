
( ()=>{
    var file = document.getElementById('image');
    
    file.addEventListener('change', (e)=> {
        for(var i = 0; i < file.files.length; i++){
            console.log(i);
        }
        var imgId = Math.floor(Math.random() * 30000) + '_' + Date.now();
        console.log(imgId);
        createImages(file, i, imgId)
    })

    function createImages(file, i, imgId){
        var divImg = document.createElement('div');
        divImg.classList.add('divImg', imgId);
        divImg.dataset.id = imgId;
        document.getElementById('preView-img').innerHTML =""

        divImg.setAttribute('style', `background-image: url(${URL.createObjectURL( file.files[0])})`);
        document.getElementById('preView-img').appendChild(divImg)
    }
})()