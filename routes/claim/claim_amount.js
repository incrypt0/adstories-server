const express = require("express");
const { route } = require("../ad/ad");
const Claim = require("../../schemas/Claim");
const { response } = require("express");
const router = express.Router();

/**
 * @route GET /claim
 * @desc Claim Amount
 * @access Public
 */
router.get("/", (req, res) => {
  res.render("claim.ejs");
});

/**
 * @route POST /claim
 * @desc Claim Amount
 * @access Public
 */

router.post("/", (req, res) => {
  console.log(req.body);
  Claim.findOne({ uid: req.body.uid }).then((val) => {
    if (!(req.body.upi && req.body.uid)) {
      return res.send("Please Fill all the fields");
    } else if (val) {
      console.log(val);
      Claim.updateOne(
        {
          _id: val._id,
          submitted: true,
        },
        { upi: req.body.upi, viewsurl: req.body.url }
      )
        .then((v) => {
          var msg = "Claim Registered";
          return res.render("claim.ejs");
        })
        .catch((e) => {
          var msg = "An Error Occured Please Try Again";
          return res.render("claim.ejs");
        });
    } else {
      var msg = "Unique ID does not match any documents";
      return res.render("claim.ejs");
    }
  });
});

router.post("/ver", (req, res) => {
  Claim.findOne({ uid: req.body.uid }).then((val) => {
    if (val) {
      res.send("Still Processing");
    } else {
      res.send("ID does not match any documents");
    }
  });
});
module.exports = router;
