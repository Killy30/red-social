const express = require('express');
const passport = require('passport')
const User = require('../database/user');
const Posts = require('../database/post')
const Coment = require('../database/comentario');
const Rooms = require('../database/room')
const multer = require('multer');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs')


const router = express.Router();
 
//multer post
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/imagePost'),
    filename: (req, file, cb, filename) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})
const upload = multer({storage}).single('image');
const uploadProfileImg = multer({storage}).single('img_profile');


router.get('/', (req, res) =>{
    res.render('index')
})

router.get('/registrar-usuario', async (req, res, next) => {
    res.render('registrar')
});

router.post('/registrar-usuario', passport.authenticate('local-signup', {
    successRedirect: '/inicio',
    failureRedirect: '/registrar-usuario',
    passReqToCallback: true
}));

router.get('/iniciar-sesion', (req, res, next) => {
    res.render('iniciarSesion')
});

router.post('/iniciar-sesion', passport.authenticate('local-login', {
    successRedirect: '/inicio',
    failureRedirect: '/iniciar-sesion',
    passReqToCallback: true
}));

//
router.get('/inicio', estaAutenticado, async (req, res, next) => {
    res.render('inicio',{
        user: req.user
    })
})

router.get('/usuarios',estaAutenticado, async(req, res)=> {
    let user = req.user;
    var users = await User.find();
    res.json({users, user})
})


router.get('/data', estaAutenticado, async (req, res, next) => {
    const user = req.user;
    const publicacion = await Posts.find().populate('user').populate('coment');
    let comenta = await Coment.find().populate('user').sort({timesAgo: -1})
    
    res.json({
        user,
        publicacion,
        comenta
    })
})

router.get('/comments', estaAutenticado, async (req, res, next) => {
    let comments = await Coment.find().populate('user');
    res.json({comments})
})

//users
router.get('/users', estaAutenticado, async (req, res) => {
    let myUser = req.user

    const rooms = await Rooms.find({$or:[
        {myId: myUser._id},{youId: myUser._id}
    ]}).populate('myId').populate('youId')

    const users = await User.find().populate('rooms')
    res.json({users, myUser, rooms})
})

router.post('/data', async(req, res) =>{
    
    var userd = req.user;
    upload(req, res, async(err) =>{
        if(err){
            console.log(err);
        }else{
            var publi = new Posts();
            if (req.file == undefined) {
                publi.descripcion = req.body.descripcion;
                publi.user = userd;
            }else{
                publi.descripcion = req.body.descripcion;
                publi.fotoPost = '/imagePost/'+ req.file.filename;
                publi.user = userd;
            }
            
            await publi.save();
            userd.posts.push(publi);
            await userd.save();
            res.json({resp:'resivido'})
        }
    })
})

//comentario vista
router.get('/comentar/:id', estaAutenticado, async(req, res) => {
    let id = req.params.id;
    let user = req.user
    const posts = await Posts.findOne({_id: id})
    res.render('commets', {posts, user})
})

router.get('/postComment/:id', estaAutenticado, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const post = await Posts.findById({_id: id}).populate('user').populate('coment');
    const comments = await Coment.find().populate('user');
    res.json({post,comments,user})
})

//comentario
router.post('/comment',async (req, res) =>{
    const posts = await Posts.findById({_id: req.body.id});

    var userc = req.user;
    var coment = new Coment();
    coment.comentario = req.body.comment;
    coment.user = userc;
    coment.post = posts;

    await coment.save();
    userc.coment.push(coment);
    await userc.save();
    posts.coment.push(coment);
    await posts.save();
    
    res.json({resp:'Satisfactorio'})
});

//eliminar post
router.get('/eliminar/:id',estaAutenticado, async(req, res) => {
    let id = req.params.id;
    const post = await Posts.findByIdAndDelete({_id: id})
    const allUser = await User.find()
    const user = req.user;
    let id_img = post.fotoPost.split('t/', 2)[1]

    let i = user.posts.indexOf(id)
    const i_ = user.postsSaved.indexOf(id)
    const com = await Coment.deleteMany({post:id})

    if(i >= 0){
        user.posts.splice(i, 1)
        await user.save()
    }
    if(i_ >= 0){
        user.postsSaved.splice(i_, 1)
        await user.save()
    }

    //esta es para recorrer todos los usuarios y eliminar el post en "postsSaved" si se encuentra
    allUser.forEach(async(user) => {
        let vf = user.postsSaved.includes(id)
        if(vf){
            let index = user.postsSaved.indexOf(id)
            if (index >= 0) {
                user.postsSaved.splice(index, 1)
                await user.save()
            }
        }
    })

    //esto borra el imagen en el folde imagePost
    fs.unlink(path.join(__dirname, `../public/imagePost/${id_img}`), function(err){
        if(err){
            console.log(err);
        }
    })

    res.json({ data: 'Post eliminado' })
})

//like
router.post('/like/:id', async(req, res) => {
    const _ids = JSON.parse(req.params.id)
    var post = await Posts.findById({_id: _ids.post_id})

    let v_f = post.like.includes(req.user._id)

    if(v_f == false){
        post.like.push(req.user)
        await post.save()
    }else{
        let i = post.like.indexOf(req.user._id)
        post.like.splice(i,1)
        await post.save()
    }

    res.json({v_f})
})

//funcion para la vista de los posts guardados
router.get('/guardados',estaAutenticado, async(req, res) => {
    let user = req.user;
    const myUser = await User.findOne({_id: user._id}).populate('posts');
    let p_s = [];
    for(var i  = 0; i <= user.postsSaved.length; i++){
        if(user.postsSaved[i] != undefined){
            let post = await Posts.findById({_id: user.postsSaved[i]})
            p_s.push(post)
        }
    }
    res.render('guardados', {myUser, p_s, user})
})

//funcion para guardar los posts
router.post('/savedPost/:id', async(req, res) => {
    const user = req.user;
    let id = req.params.id;
    const post = await Posts.findById({_id:id});
    const fv = user.postsSaved.includes(id)
    if(fv == false){
        user.postsSaved.push(post)
        await user.save()
    }else{
        let ind = user.postsSaved.indexOf(id)

        if(ind >= 0){
            user.postsSaved.splice(ind, 1)
            await user.save()
        }
    }
    res.json(fv)
})

//message
require('./message')(router, estaAutenticado)
require('./config')(router, estaAutenticado)


//vista de mi perfil
router.get('/my_perfil', estaAutenticado,async(req,res) => {
    var usuario = req.user;
    const user = await User.findOne({_id:usuario._id}).populate('posts');
    
    res.render('my_perfil', {
        user :  user
    })
})

router.get('/my_posts', estaAutenticado, async (req, res) =>{
    var my_user = req.user;
    const posts = await Posts.find({user:my_user._id}).populate('user').populate('coment');
    res.json({posts})
}) 

// //vista de para cambiar foto de perfil
// router.get('/cambiar_foto_perfil', estaAutenticado,async(req,res) => {
//     var user = req.user;
//     res.render('cambiarFoto', { user })
// })

// //cambiar foto de perfil
// router.post('/cambiar_foto_perfil', async(req, res) =>{
//     let usuario = req.user;
     
//     upload(req, res, async (err) =>{
//         if(err){
//             console.log(err);
//         }else{
//             await User.updateOne({_id: usuario._id}, {$set: {userFoto: '/imagePost/' + req.file.filename}})
//         }
//     })

//     res.redirect('/config')
// })

//vista de perfil de los usuarios
router.get('/perfil/:id', estaAutenticado,async(req,res) => {
    let user = req.user;
    const users = await User.findById({_id: req.params.id}).populate('posts');
    res.render('perfil', {user, users })
})

//vista para buscar usuarios
router.get('/usuario', estaAutenticado, async (req, res) => {
    const user = req.user
    const users = await User.find();
    res.render('users', {users, user})
})

// //vista de configuraciones
// router.get('/config', estaAutenticado, (req, res) =>{
//     const user = req.user
//     res.render('configuracion', {user})
// })

router.post('/follow', estaAutenticado, async(req, res) =>{
    let id = req.body._id;
    let user = req.user
    const userID = await User.findById({_id: id})

    let v_f = user.linked.includes(id)

    if(v_f == false){
        user.linked.push(userID)
        userID.followers.push(user)
        await user.save()
        await userID.save()
    }else{
        let i = user.linked.indexOf(id)
        let x = user.followers.indexOf(user._id)

        user.linked.splice(i,1)
        userID.followers.splice(x,1)
        await user.save()
        await userID.save()
    }

    res.json({res:v_f})
})

//actualizar los datos de la vista config
// router.post('/config', async(req, res) =>{
//     let _user = req.user;
//     let data = req.body;
//     uploadProfileImg(req, res, async(err)=>{
//         if(err){
//             console.log(err);
//         }else{
//             if(req.file == undefined){
//                 console.log(data);
//                 await User.updateOne({_id: _user._id},{$set: {nombre: data.c_nombre}})
//                 await User.updateOne({_id: _user._id},{$set: {bio: data.bio}})
//                 await User.updateOne({_id: _user._id},{$set: {pais: data.pais}})
//                 await User.updateOne({_id: _user._id},{$set: {cuidad: data.cuidad}})
//                 await User.updateOne({_id: _user._id},{$set: {dia: data.dia}})
//                 await User.updateOne({_id: _user._id},{$set: {mes: data.mes}})
//                 await User.updateOne({_id: _user._id},{$set: {ano: data.ano}})
//             }else{
//                 console.log(req.file);
//                 await User.updateOne({_id: _user._id},{$set: {nombre: data.c_nombre}})
//                 await User.updateOne({_id: _user._id},{$set: {bio: data.bio}})
//                 await User.updateOne({_id: _user._id},{$set: {pais: data.pais}})
//                 await User.updateOne({_id: _user._id},{$set: {cuidad: data.cuidad}})
//                 await User.updateOne({_id: _user._id},{$set: {dia: data.dia}})
//                 await User.updateOne({_id: _user._id},{$set: {mes: data.mes}})
//                 await User.updateOne({_id: _user._id},{$set: {ano: data.ano}})
//             }
//         }
//     })

//     res.redirect('/config')
// })

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/')
})

function estaAutenticado(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

module.exports = router;