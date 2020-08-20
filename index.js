const express = require("express");
const { response } = require("express");
const app = express();
app.use(express.static("public"));
adList = ["santoor", "chandrika"];
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

app.get("/:ad", (req, res) => {
  ad = req.params.ad;
  if (adList.includes(ad)) res.render("index.ejs");
  else res.send("404 page note found");
});
var i = 10000000;
app.post("/:ad", (req, res) => {
  ad = req.params.ad;
  uid = i.toString(36);
  
  uidurl = `/${ad}/${i.toString(36)}`;
  i += 1;
  res.render("uid.ejs");
});
app.post("/:ad/:uid", (req, res) => {
  ad = req.params.ad;
  uid = req.params.uid;
  console.log(req.body);
  res.send("success");
});
app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
