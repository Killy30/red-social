const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/BaseDeDato', {
  useNewUrlParser: true 
})
  .then(db => console.log('Connected to Database'))
  .catch(err => console.log('Not Connected to Database ERROR! ' + err));
  