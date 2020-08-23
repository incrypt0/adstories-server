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
  upi: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  viewsurl: {
    type: String
  },
  img: {
    type: String
  },
  submitted: {
    type: Boolean,
    "default": false
  },
  verified: {
    type: Boolean,
    "default": false
  },
  payment: {
    type: Boolean,
    "default": false
  }
});
module.exports = Claim = mongoose.model("claims", ClaimSchema);