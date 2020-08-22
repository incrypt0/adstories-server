const express = require("express");
const { response } = require("express");
const app = express();
const Jimp = require("jimp");
const waterMarkImage = require("./imagegen");
var adsRoute = require("./routes/ad/ad");
app.use(express.static(__dirname + "/public"));


app.set("view-engine", "ejs");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/:ad", adsRoute);
app.get("/", (req, res) => {
  res.redirect("/adtstories");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
