const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://killy:postLine-db@cluster0.4d4vw.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true 
})
  .then(db => console.log('Connected to Database'))
  .catch(err => console.log('Not Connected to Database ERROR! ' + err));
  