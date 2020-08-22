const express = require("express");
const { response } = require("express");
const app = express();
const Jimp = require("jimp");
const mongoose = require("mongoose");

const waterMarkImage = require("./imagegen");
var adsRoute = require("./routes/ad/ad");
app.use(express.static(__dirname + "/public"));

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected successfully ${db}`);
  })
  .catch((err) => {
    console.log(`Unable to connect to the database ${err}`);
  });

app.set("view-engine", "ejs");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/:ad", adsRoute);
app.get("/", (req, res) => {
  res.redirect("/adstories");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
