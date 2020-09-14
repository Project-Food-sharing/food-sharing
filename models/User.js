const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  zipcode: String,
  houseNumber: String,
  street: String,
  food:{
    type: Schema.Types.ObjectId,
    ref: 'Food'
  },
  latitude:String,
  longitude:String
});
const User = mongoose.model('User', userSchema);
module.exports = User;