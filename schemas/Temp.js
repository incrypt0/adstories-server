const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
//Create a user model

const TempSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },

  wmid: {
    type: String,
    required: true,
  },
});

module.exports = function TempConstructor() {
  this.fromCollection = function (ad) {
    return mongoose.model("temp_" + ad, TempSchema);
  };
};
