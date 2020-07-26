const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BaseDeDatos', {
  useNewUrlParser: true 
})
  .then(db => console.log('database conectado '))
  .catch(err => console.log('hay un error con mongo ' + err));