const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  zipcode: Number,
  houseNumber: String,
  street: String,
  food: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  latitude: String,
  longitude: String,
  role: {
    type: Boolean,
    default:false
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
