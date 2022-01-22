const express = require('express');
const app = express();

const server = require('http').createServer(app)

const io = require('socket.io')(server)

const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./database/user');
const multer = require('multer');
const formidable = require('formidable');
const {format} = require('timeago.js');
const Rooms = require('./database/room');

require('./database/config');
require('./passport/local-aut');

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 80);

app.use(express.static(path.join(__dirname, 'views')));


app.use(express.urlencoded({extended: false}));
app.use(express.json())

//session
app.use(session({
    secret: 'miSecreto',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session()) 


app.use( async(req, res, next) => {
    app.locals.registroMessage   = req.flash('registroMessage');
    app.locals.iniciarMessage   = req.flash('iniciarMessage');
    app.locals.format = format;
    app.locals.userA = await User.find();
    next();
})

app.use( require('./routes/index'));
app.use(express.static(path.join(__dirname, 'public'))); 

//---------------------------------------------------------------------
// socket
const storage = multer.diskStorage({
    destination: path.join(__dirname, './public/imagePost'),
    filename: (req, file, cb, filename) =>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})



const upload = multer({storage}).single('image')

io.on('connection', async(socket) => {
    console.log('chat connect');

    socket.on('user_to_join', data => {
        socket.join(data.roomId)
    })

    socket.on('user_is_typping', (data) => {
        socket.to(data.roomId).broadcast.emit('user_is_typping', data)
    })

    app.post('/upload-img-to-send', async(req, res) =>{    
        upload(req, res, async(err) =>{
            if(err){
                console.log(err);
            }else{
                
                let data = req.body;
                const room = await Rooms.findOne({_id: req.body.roomId}).populate('myId')
                // let room = await Room.findOne({groupeId:req.body.idGroupe}).populate('users').populate('groupeId')
                if (req.file == undefined) {
        
                    let = mssg = {myIdMsg: req.body.myId, message: req.body.message}

                    room.messages.push(mssg)
                    room.dateMessage = Date.now()

                    await room.save()
                    let room_ = await Rooms.findOne({_id: req.body.roomId})
                    io.in(room._id).emit('send_message', {data, room, room_})
                }else{
                    let = mssg = {
                        myIdMsg: req.body.myId, 
                        message: req.body.message,
                        img: '/imagePost/'+ req.file.filename
                    }
                    
                    room.messages.push(mssg)
                    room.dateMessage = Date.now()
                    await room.save()
                    let room_ = await Rooms.findOne({_id: data.roomId})
                    io.in(room._id).emit('send_message', {data, room, room_})
                }
            } 
        })
        res.json('sucess')
    })

    socket.on('send_message', async(data) =>{
        if(data.roomId != undefined){
            const user = await User.findById({_id: data.theUserId})
            const myUser = await User.findById({_id: data.myId})
            const room = await Rooms.findOne({_id: data.roomId})
            let = mssg = {myIdMsg: data.myId, message: data.message}
            
            room.messages.push(mssg)
            room.dateMessage = Date.now()
            await room.save()

            let room_ = await Rooms.findOne({_id: data.roomId})
            io.in(room._id).emit('send_message', {data, room, room_})
        }
    })
    
    socket.on('notificacion_msj', async (data) =>{
        
        if(data.roomId != undefined){
            const room = await Rooms.findOne({_id: data.roomId})
            
            io.emit('notificacion_msj', {data, room})
        }
    })

    socket.on('view_message', async (data) =>{
        if(data.roomId != undefined){
            const myUser = await User.findById({_id: data.myId})
            const room = await Rooms.findOne({_id: data.roomId})

            let lastMessage = room.messages.find(item =>{
                return item._id == data.id_msg
            })
        
            if(lastMessage != undefined){
                if(lastMessage.myIdMsg != myUser._id){
                    if(lastMessage.viewMsg.view == false){
                        
                        let obj = {view: view=true, dateView: Date.now()}
                        lastMessage.viewMsg = obj
                        await room.save()
                        socket.emit('view_message', {data, room})
                        socket.to(room._id).broadcast.emit('view_message_room', {data, room})
                    }
                }
            }
        }
    })
})


server.listen(app.get('port'), () => {
    console.log('servidor conectado ', app.get('port'));
    
})