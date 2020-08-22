"use strict";

var express = require("express");

var _require = require("express"),
    response = _require.response;

var app = express();

var Jimp = require("jimp");

var mongoose = require("mongoose");

var waterMarkImage = require("./imagegen");

var adsRoute = require("./routes/ad/ad");

app.use(express["static"](__dirname + "/public"));

var db = require("./config/keys").mongoURI;

mongoose.connect(db, {
  useNewUrlParser: true
}).then(function () {
  console.log("Database connected successfully ".concat(db));
})["catch"](function (err) {
  console.log("Unable to connect to the database ".concat(err));
});
app.set("view-engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use("/:ad", adsRoute);
app.get("/", function (req, res) {
  res.redirect("/adstories");
});
app.listen(3000, function () {
  console.log("listening on http://localhost:3000");
});