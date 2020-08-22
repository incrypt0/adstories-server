const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");

var adList = ["santoor", "chandrika"];

// Ads Route
router.get("/", (req, res) => {
  ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs");
  else res.send("404 page note found");
});

// Unique ID generation

router.post("/", (req, res) => {
  ad = req.params.ad;
  // res.render("uid.ejs");
  res.json(req.body);
});

// Watermark and
router.post("/watermark", (req, res) => {
  console.log(req.body);

  // var buf= await waterMarkImage("public/images/poster.jpg");
  //     console.log(buf.substring(0,25));
  //     res.send(buf)
  var watermarkText = shortid.generate();
  var uid = shortid.generate();
  
  waterMarkImage("public/images/poster.jpg",watermarkText).then((buf) => {
    var data={
      buffer:buf,
      wmid:watermarkText,
      uid:uid
    }
    console.log(buf.substring(0, 25));
    res.json(data);
  });
});

module.exports = router;
