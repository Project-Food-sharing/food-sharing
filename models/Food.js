const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const celebritySchema = new Schema({
  title: String,
  description: String,
  categories: {
    type: [String],
    enum: ["Raw", "Prepared", "Drinks"],
  },
  status: {
    type: String,
    enum: ["Available", "Blocked", "Gone"],
    default: "Available",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  latitud: String,
  longitud: String,
  date: {
    type: Date,
    default: Date.now,
  },
  imgName: String,
  imgPath: String,
  imgPublicId: String,
});

const Food = mongoose.model("Food", celebritySchema);
module.exports = Food;
