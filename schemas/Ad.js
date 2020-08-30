const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create a user model

const AdSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = Ad= mongoose.model("Ads", AdSchema);
 

