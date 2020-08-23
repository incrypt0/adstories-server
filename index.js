var env = process.argv[2] || "dev";
switch (env) {
  case "dev":
    // Setup development config
    // dotenv config
    require("dotenv").config({ path: "./.env" });
    console.log("Running in dev mode");
    break;
  case "prod":
    // Setup production config
    break;
}

const express = require("express");
const { response } = require("express");
const app = express();
const Jimp = require("jimp");
const mongoose = require("mongoose");

const waterMarkImage = require("./imagegen");

// Routes
var adsRoute = require("./routes/ad/ad");
var claimAmountRoute = require("./routes/claim/claim_amount");

// Static directory
app.use(express.static(__dirname + "/public"));

// Mongo URI
const db = require("./config/keys").mongoURI;

// Connect to mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected successfully ${db}`);
  })
  .catch((err) => {
    console.log(`Unable to connect to the database ${err}`);
  });

// Setting ejs as view engine
app.set("view-engine", "ejs");

// json essentials
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routes
app.use("/claim", claimAmountRoute);
app.use("/:ad", adsRoute);

// Root
app.get("/", (req, res) => {
  res.redirect("/adstories");
});
var port =process.env.PORT || 3000
app.listen(port, () => {
  console.log("listening on " + port);
});
