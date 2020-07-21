const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema, model} = require('mongoose');

var userSchema = new Schema({
    nombre: {type: String},
    email:  {type: String},
    password: {type: String},
    userFoto: {type: String},
    estudio: {type: String},
    pais: {type: String},
    cuidad: {type: String},
    dia: {type: Number},
    mes: {type: String},
    ano: {type: Number},
    posts: [{ type: Schema.Types.ObjectId, ref: 'post' }],
    postsSaved: [{ type: Schema.Types.ObjectId, ref: 'post' }],
    coment: [{ type: Schema.Types.ObjectId, ref: 'coment' }],
    rooms: [{type: Schema.Types.ObjectId, ref: 'Rooms'}],
    like: { type: Schema.Types.ObjectId, ref: 'post' },
    dateMessage: {type: Date}
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = model('User', userSchema);