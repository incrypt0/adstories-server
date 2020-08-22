const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");
const Claim = require("../../schemas/Claim");

var adList = ["adstories", "santoor", "chandrika"];

// Ads Route
router.get("/", (req, res) => {
  ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs");
  else res.send("404 page note found");
});

// Unique ID generation
router.post("/", (req, res) => {
  // Check whether unique id already exist
  Claim.findOne({
    uid: req.body.uid,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "Already Registered for claim",
      });
    }

    // Check whether wmid already exist
    Claim.findOne({
      wmid: req.body.wmid,
    }).then((user) => {
      if (user) {
        return res.status(400).json({
          msg: "Already Registered for claim",
        });
      }
    });

    // Create new Claim
    let newClaim;
    try {
      newClaim = new Claim({
        name: req.body.name,
        wanumber: req.body.wanumber,
        img: req.body.img,
        url: req.body.url,
        uid: req.body.uid,
        wmid: req.body.uid,
      });
    } catch (e) {
      return res.status(400).json({
        msg: "Already Registered for claim",
      });
    }

    //  Save claim to databse
    newClaim
      .save()
      .then((claim) => {
        return res.status(201).json({
          success: true,
          msg: "Your Unique ID is ",
          uid: req.body.uid,
        });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).send("An error occured please try again");
      });
  });
});

// Watermark and
router.post("/watermark", (req, res) => {
  // Generate unique ID's
  var watermarkText = shortid.generate();
  var uid = shortid.generate();

  // Watermark the ad
  waterMarkImage("public/images/poster.jpg", watermarkText)
    .then((buf) => {
      var data = {
        success: true,
        buffer: buf,
        wmid: watermarkText,
        uid: uid,
      };
      console.log(buf.substring(0, 25));
      res.json(data);
    })
    .catch((e) => {
      var data = {
        success: true,
        msg: "Cannot generate download please try again later.",
      };
    });
});

module.exports = router;
