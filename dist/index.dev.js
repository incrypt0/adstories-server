"use strict";

var env = process.argv[2] || "dev";

switch (env) {
  case "dev":
    // Setup development config
    // dotenv config
    require("dotenv").config();

    console.log("Running in dev mode");
    break;

  case "prod":
    // Setup production config
    break;
}

var express = require("express");

var _require = require("express"),
    response = _require.response;

var app = express();

var Jimp = require("jimp");

var mongoose = require("mongoose");

var waterMarkImage = require("./imagegen"); // Routes


var adsRoute = require("./routes/ad/ad");

var claimAmountRoute = require("./routes/claim/claim_amount"); // Static directory


app.use(express["static"](__dirname + "/public")); // Mongo URI

var db = require("./config/keys").mongoURI; // Connect to mongoose


mongoose.connect(db, {
  useNewUrlParser: true
}).then(function () {
  console.log("Database connected successfully ".concat(db));
})["catch"](function (err) {
  console.log("Unable to connect to the database ".concat(err));
}); // Setting ejs as view engine

app.set("view-engine", "ejs"); // json essentials

app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); // Routes

app.use("/claim", claimAmountRoute);
app.use("/:ad", adsRoute); // Root

app.get("/", function (req, res) {
  res.redirect("/adstories");
});
app.listen(3000, function () {
  console.log("listening on http://localhost:3000");
});