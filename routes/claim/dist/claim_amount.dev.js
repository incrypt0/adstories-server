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
  }).then(function (doc) {
    if (!(req.body.upi && req.body.uid)) {
      var msg = "Please Fill all the fields";
      return res.render("claim.ejs", {
        msg: msg
      });
    } else if (doc) {
      console.log(doc);
      doc.submitted = true;
      doc.upi = req.body.upi;
      doc.viewsurl = req.body.url;

      try {
        doc.save();
        var msg = "Claim Registered";
        return res.render("claim.ejs", {
          msg: msg
        });
      } catch (error) {}

      Claim.updateOne({
        _id: val._id
      }, {
        submitted: true,
        upi: req.body.upi,
        viewsurl: req.body.url
      }).then(function (v) {
        var msg = "Claim Registered";
        return res.render("claim.ejs", {
          msg: msg
        });
      })["catch"](function (e) {
        var msg = "An Error Occured Please Try Again";
      });
    } else {
      var msg = "Unique ID does not match any documents";
      return res.render("claim.ejs", {
        msg: msg
      });
    }
  });
});
router.get("/status", function (req, res) {
  res.render("status_check.ejs");
});
router.post("/status", function (req, res) {
  if (req.body.uid) {
    Claim.findOne({
      uid: req.body.uid
    }).then(function (val) {
      if (val) {
        res.render("msg.ejs", {
          msg: "",
          heading: val.payment
        });
      } else {
        res.send("ID does not match any documents");
      }
    });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router;