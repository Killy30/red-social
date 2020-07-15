const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const User = mongoose.model('User');
const {format} = require('timeago.js')

var postSchema = new Schema({
    descripcion:  {type: String},
    fotoPost: { type: String},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    coment: [{ type: Schema.Types.ObjectId, ref: 'coment' }],
    timesAgo: {type: Date, default: Date.now}
});

postSchema.virtual('fullDate').get(() => {
    return format(this.timesAgo)
})

module.exports = model('post', postSchema);