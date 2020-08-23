"use strict";

var express = require("express");

var _require = require("../ad/ad"),
    route = _require.route;

var Claim = require("../../schemas/Claim");

var _require2 = require("express"),
    response = _require2.response;

var router = express.Router();
/**
 * @route GET /claim
 * @desc Claim Amount
 * @access Public
 */

router.get("/", function (req, res) {
  res.render("claim.ejs");
});
/**
 * @route POST /claim
 * @desc Claim Amount
 * @access Public
 */

router.post("/", function (req, res) {
  console.log(req.body);
  Claim.findOne({
    uid: req.body.uid
  }).then(function (val) {
    if (!(req.body.upi && req.body.uid)) {
      return res.send("Please Fill all the fields");
    } else if (val) {
      console.log(val);
      Claim.updateOne({
        _id: val._id,
        submitted: true
      }, {
        upi: req.body.upi,
        viewsurl: req.body.url
      }).then(function (v) {
        var msg = "Claim Registered";
        return res.render("claim.ejs");
      })["catch"](function (e) {
        var msg = "An Error Occured Please Try Again";
        return res.render("claim.ejs");
      });
    } else {
      var msg = "Unique ID does not match any documents";
      return res.render("claim.ejs");
    }
  });
});
router.post("/ver", function (req, res) {
  Claim.findOne({
    uid: req.body.uid
  }).then(function (val) {
    if (val) {
      res.send("Still Processing");
    } else {
      res.send("ID does not match any documents");
    }
  });
});
module.exports = router;