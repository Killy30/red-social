const User = require('../database/user');
const path = require('path');
const multer = require('multer');

//multer profile image
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/imagePost'),
    filename: (req, file, cb, filename) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})

const upload = multer({storage}).single('image')

module.exports = (router, estaAutenticado) =>{

    //vista de configuraciones
    router.get('/config', estaAutenticado, (req, res) =>{
        const user = req.user
        res.render('configuracion', {user})
    })

    router.post('/config', estaAutenticado,  async(req, res) =>{
        let _user = req.user;
        let data = req.body;
        console.log(data);
        upload(req, res, async(err)=>{
            if(err){
                console.log(err);
            }else{
                if(req.file == undefined){
                    
                    await User.updateOne({_id: _user._id},{$set: {nombre: data.c_nombre}})
                    await User.updateOne({_id: _user._id},{$set: {bio: data.bio}})
                    await User.updateOne({_id: _user._id},{$set: {pais: data.pais}})
                    await User.updateOne({_id: _user._id},{$set: {cuidad: data.cuidad}})
                    await User.updateOne({_id: _user._id},{$set: {dia: data.dia}})
                    await User.updateOne({_id: _user._id},{$set: {mes: data.mes}})
                    await User.updateOne({_id: _user._id},{$set: {ano: data.ano}})
                }else{
                    
                    await User.updateOne({_id: _user._id},{$set: {userFoto: '/imagePost/' + req.file.filename}})
                    await User.updateOne({_id: _user._id},{$set: {nombre: data.c_nombre}})
                    await User.updateOne({_id: _user._id},{$set: {bio: data.bio}})
                    await User.updateOne({_id: _user._id},{$set: {pais: data.pais}})
                    await User.updateOne({_id: _user._id},{$set: {cuidad: data.cuidad}})
                    await User.updateOne({_id: _user._id},{$set: {dia: data.dia}})
                    await User.updateOne({_id: _user._id},{$set: {mes: data.mes}})
                    await User.updateOne({_id: _user._id},{$set: {ano: data.ano}})
                }
            }
        })
    
        res.redirect('/config')
    })

    return router
}