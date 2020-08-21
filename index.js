const express = require("express");
const { response } = require("express");
const app = express();
const Jimp = require("jimp");
const waterMarkImage = require("./imagegen");
var adsRoute = require('./routes/ad/ad');
app.use(express.static(__dirname+"/public"));
app.use('/:ad',adsRoute)


app.set("view-engine", "ejs");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.redirect("/santoor");
});

// app.get("/:ad", (req, res) => {
//   ad = req.params.ad;
//   if (adList.includes(ad)) res.render("index.ejs");
//   else res.send("404 page note found");
// });




app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
