const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();

var adList = ["santoor", "chandrika"];


// Ads Route
router.get("/", (req, res) => {
  ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs");
  else res.send("404 page note found");
});

// Unique ID generation
var i = 10000000;
router.post("/", (req, res) => {
  ad = req.params.ad;
  uid = i.toString(36);

  uidurl = `/${ad}/${i.toString(36)}`;
  i += 1;
  res.render("uid.ejs");
});


router.post("/watermark",async (req, res) => {

  var buf= await waterMarkImage("public/images/poster.jpg");

      console.log(buf.substring(0,25));
      res.send(buf)

  
});

module.exports = router;
