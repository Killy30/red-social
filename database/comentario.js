const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const User = mongoose.model('User');

var comentSchema = new Schema({
    comentario: {type: String},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'post' },
    timesAgo: {type: Date, default: Date.now }
});


module.exports = model('coment', comentSchema);