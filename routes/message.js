const User = require('../database/user');
const Posts = require('../database/post')
const Coment = require('../database/comentario');
const Rooms = require('../database/room')
const path = require('path');

module.exports = (router, estaAutenticado) =>{

    
    //vista de messager
    router.get('/message', estaAutenticado, async (req, res) => {
        const user = req.user
        res.render('message', {user})
    })

    router.get('/my_rooms', estaAutenticado, async (req, res) =>{
        const myUser = req.user;
        const rooms = await Rooms.find({$or:[
            {myId: myUser._id},{youId: myUser._id}
        ]}).populate('myId').populate('youId')

        res.json(rooms)
    })

    //funcion para crear un nuevo room para el chat
    //este room se creara cuando le das click a un usuario de la lista
    router.post('/userToChat/:id', async(req, res) => {
        const idUser = req.params.id
        const myUser = req.user
        try {
            if(idUser != undefined && myUser._id != idUser){
                const user = await User.findById({_id: idUser})
                
                //verificar si existe un room con los ids de los usuarios
                const room = await Rooms.findOne({$and:[
                    {myId: {$in:[user.id, myUser.id]}},
                    {youId: {$in:[user.id, myUser.id]}}
                ]})
                
                //si no existe crealo
                if(room == null){
                    const newRoom = new Rooms()
                    newRoom.myId = myUser;
                    newRoom.youId = user;
    
                    await newRoom.save();
                    myUser.rooms.push(newRoom);
                    user.rooms.push(newRoom)
                    await myUser.save();
                    await user.save()
    
                    return res.json({user, room:newRoom})
                }
                
                return res.json({user,room})
            }
        } catch (error) {
            console.log(error);
            console.log('El id ', idUser, ' no esta definido o es igual a este id ', myUser._id);
        }
    })

    //message send
    router.post('/messageSend/:msg', async(req, res) => {
        const data = JSON.parse(req.params.msg)
        const myUser = req.user;
        console.log(req.body);
        
        if(req.body.roomId != undefined){
            const room = await Rooms.findById({_id: req.body.roomId})
            let = mssg = {myIdMsg: myUser.id, message: req.body.text}
        
            room.messages.push(mssg)
            await room.save()
            return res.json({room})
        }
        console.log('El id del room esta indefinido');
    })



    return router
}