const {Schema, model} = require('mongoose')

const roomSchema = new Schema({
    messages: [{
        myIdMsg: String,
        message: String,
        dateMsg: {type: Date, default: Date.now}
    }],
    myId:   { type: Schema.Types.ObjectId, ref: 'User' },
    youId:  {type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = model('Rooms', roomSchema)