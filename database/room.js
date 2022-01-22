const {Schema, model} = require('mongoose')

const roomSchema = new Schema({
    messages: [{
        myIdMsg: String,
        message: String,
        img: String,
        dateMsg: {type: Date, default: Date.now},
        viewMsg: {
            view: {type: Boolean, default: false},
            dateView: {type: Date}
        }
    }],
    dateMessage:{type: Date},
    myId:       { type: Schema.Types.ObjectId, ref: 'User' },
    youId:      {type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = model('Rooms', roomSchema)