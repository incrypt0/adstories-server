"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; //Create a user model

var ClaimRequestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
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
    type: String,
    required: true
  }
});
module.exports = User = mongoose.model("users", UserSchema);