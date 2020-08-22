"use strict";

var express = require("express");

var waterMarkImage = require("../../imagegen");

var router = express.Router();

var shortid = require("shortid");

var Claim = require("../../schemas/Claim");

var adList = ["adstories", "santoor", "chandrika"]; // Ads Route

router.get("/", function (req, res) {
  ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs");else res.send("404 page note found");
}); // Unique ID generation

router.post("/", function (req, res) {
  // Check whether unique id already exist
  Claim.findOne({
    uid: req.body.uid
  }).then(function (user) {
    if (user) {
      return res.status(400).json({
        msg: "Already Registered for claim"
      });
    } // Check whether wmid already exist


    Claim.findOne({
      wmid: req.body.wmid
    }).then(function (user) {
      if (user) {
        return res.status(400).json({
          msg: "Already Registered for claim"
        });
      }
    }); // Create new Claim

    var newClaim;

    try {
      newClaim = new Claim({
        name: req.body.name,
        wanumber: req.body.wanumber,
        img: req.body.img,
        url: req.body.url,
        uid: req.body.uid,
        wmid: req.body.uid
      });
    } catch (e) {
      return res.status(400).json({
        msg: "Already Registered for claim"
      });
    } //  Save claim to databse


    newClaim.save().then(function (claim) {
      return res.status(201).json({
        success: true,
        msg: "Your Unique ID is ",
        uid: req.body.uid
      });
    })["catch"](function (e) {
      console.log(e);
      return res.status(400).send("An error occured please try again");
    });
  });
}); // Watermark and

router.post("/watermark", function (req, res) {
  // Generate unique ID's
  var watermarkText = shortid.generate();
  var uid = shortid.generate(); // Watermark the ad

  waterMarkImage("public/images/poster.jpg", watermarkText).then(function (buf) {
    var data = {
      success: true,
      buffer: buf,
      wmid: watermarkText,
      uid: uid
    };
    console.log(buf.substring(0, 25));
    res.json(data);
  })["catch"](function (e) {
    var data = {
      success: true,
      msg: "Cannot generate download please try again later."
    };
  });
});
module.exports = router;