const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BaseDeDato', {
  useNewUrlParser: true 
})
  .then(db => console.log('database conectado '))
  .catch(err => console.log('hay un error con mongo ' + err));