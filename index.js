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


// socket
io.on('connection', async(socket) => {
    console.log('chat connect');

    socket.on('user_to_join', data => {
        socket.join(data.roomId)
    })

    socket.on('user_is_typping', (data) => {
        socket.to(data.roomId).broadcast.emit('user_is_typping', {type:'Esta escribiendo'})
    })

    socket.on('send_message', async(data) =>{

        if(data.roomId != undefined){
            const user = await User.findById({_id: data.theUserId})
            const myUser = await User.findById({_id: data.myId})
            const room = await Rooms.findOne({_id: data.roomId}).populate('user')
            let = mssg = {myIdMsg: data.myId, message: data.message}
            
            room.messages.push(mssg)
            myUser.dateMessage = Date.now()
            user.dateMessage = Date.now()
            await room.save()
            await user.save()
            await myUser.save()
            socket.to(room._id).emit('send_message', data)
        }
    })
})

server.listen(app.get('port'), () => {
    console.log('servidor conectado ', app.get('port'));
    
})