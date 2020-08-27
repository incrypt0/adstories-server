const express = require("express");
const { route } = require("../ad/ad");
const ClaimConstructor = require("../../schemas/Claim");
const { response } = require("express");
const router = express.Router();
const Claim = new ClaimConstructor();
/**
 * @route GET /claim
 * @desc Claim.fromCollection(ad) Amount
 * @access Public
 */
router.get("/", (req, res) => {
  var url =req.originalUrl;
  
  res.render("claim.ejs",{url:url});
});

router.get("/:ad", (req, res) => {
  var ad = req.params.ad;
  res.render("claim.ejs");
});

/**
 * @route POST /claim
 * @desc Claim.fromCollection(ad) Amount
 * @access Public
 */

router.post("/", (req, res) => {
  var ad = req.params.ad;
  console.log(req.body);
  Claim.fromCollection(ad)
    .findOne({ uid: req.body.uid })
    .then((doc) => {
      if (!(req.body.upi && req.body.uid)) {
        var msg = "Please Fill all the fields";
        return res.render("claim.ejs", { msg: msg });
      } else if (doc) {
        console.log(doc);
        doc.submitted = true;
        doc.upi = req.body.upi;
        doc.viewsurl = req.body.url;
        try {
          doc.save();
          var msg = "Claim.fromCollection(ad) Registered";

          return res.render("claim.ejs", { msg: msg });
        } catch (error) {}
        Claim.fromCollection(ad)
          .updateOne(
            {
              _id: val._id,
            },
            { submitted: true, upi: req.body.upi, viewsurl: req.body.url }
          )
          .then((v) => {
            var msg = "Claim.fromCollection(ad) Registered";

            return res.render("claim.ejs", { msg: msg });
          })
          .catch((e) => {
            var msg = "An Error Occured Please Try Again";
          });
      } else {
        var msg = "Unique ID does not match any documents";
        return res.render("claim.ejs", { msg: msg });
      }
    });
});

router.get("/status", (req, res) => {
  var ad = req.params.ad

  res.render("status_check.ejs");
});

router.post("/status", (req, res) => {

  var ad=req.originalUrl.split('/').reverse()[0];
  if (req.body.uid) {
    Claim.fromCollection(ad)
      .findOne({ uid: req.body.uid })
      .then((val) => {
        if (val) {
          res.render("msg.ejs", { msg: "", heading: val.payment });
        } else {
          res.send("ID does not match any documents");
        }
      });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router;
