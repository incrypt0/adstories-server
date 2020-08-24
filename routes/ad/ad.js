const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");
const Claim = require("../../schemas/Claim");

// Mock Ads <Development only>
var adList = ["adstories", "santoor", "chandrika"];

/**
 * @route GET /:ad
 * @desc Claimin ad
 * @access Public
 */

// Ads Route
router.get("/", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs",{ad:ad});
  else res.send("404 page note found");
});

/**
 * @route POST /:ad
 * @desc Register Claim
 * @access Public
 */

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
      var ad = req.originalUrl.split("/")[1];
     
      if (user) {
      
        var msg = "Already Registered for claim";
        return res.render("index.ejs",{msg:msg});
      }

      // Create new Claim
      let newClaim;
      try {
        newClaim = new Claim({
          name: req.body.name,
          wanumber: req.body.wanumber,
          img: req.body.img,
          url: req.body.url,
          uid: req.body.uid,
          wmid: req.body.wmid,
        });
      } catch (e) {
        return res.status(400).json({
          msg: "Already Registered for claim",
        });
      }

      //  Save claim to database
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
          console.log(e)
          var msg = "An error occured please try again";
          return res.render("index.ejs", { ad: ad, msg: msg });
        });
    });
  });
});

/**
 * @route POST /:ad/watermark
 * @desc Watermark and unique id generation
 * @access Public
 */

// Watermark and Unique ID Generation
router.post("/watermark", (req, res) => {
  //
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
