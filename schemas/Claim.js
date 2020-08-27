const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
//Create a user model

const ClaimSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  wanumber: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  wmid: {
    type: String,
    required: true,
  },
  upi: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  viewsurl: {
    type: String,
  },
  img: {
    type: String,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});
ClaimSchema.plugin(mongoosePaginate);
module.exports = function ClaimConstructor() {
  this.fromCollection = function (collection) {
    return mongoose.model(collection, ClaimSchema);
  };
};
