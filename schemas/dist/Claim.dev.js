"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; //Create a user model

var ClaimSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  wanumber: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now,
    required: true
  },
  wmid: {
    type: String,
    required: true
  },
  upiid: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  img: {
    type: String
  }
});
module.exports = Claim = mongoose.model("claims", ClaimSchema);