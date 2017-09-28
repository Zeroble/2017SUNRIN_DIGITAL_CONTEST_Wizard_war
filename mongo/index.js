const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  id: {type: String},
  passwd : { type: String},
});

var Text = mongoose.model('users',userSchema);

module.exports.db = db;
module.exports.Users = Text;
