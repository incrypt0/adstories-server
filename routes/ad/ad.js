const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");
const ClaimConstructor = require("../../schemas/Claim");

const Claim = new ClaimConstructor();

// Mock Ads <Development only>
var adList = ["adstories", "santoor", "chandrika"];

/**
 * @route GET /:ad
 * @desc Claimin ad
 * @access Public
 */

// Ads Route
router.get("/", (req, res) => {
  console.log(req.originalUrl);
  var ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs", { ad: ad });
  else res.send("404 page note found");
});

/**
 * @route POST /:ad
 * @desc Register Claim
 * @access Public
 */

// Unique ID generation
router.post("/", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  console.log(ad + "pwoliye");
  // Check whether unique id already exist
  Claim.fromCollection(ad)
    .findOne({
      uid: req.body.uid,
    })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          msg: "Already Registered for claim",
        });
      }
      console.log(ad + "pwoliye2");
      // Check whether wmid already exist
      Claim.fromCollection(ad)
        .findOne({
          wmid: req.body.wmid,
        })
        .then((user) => {
          var ad = req.originalUrl.split("/")[1];
          console.log(ad + "pwoliye3");
          if (user) {
            console.log(ad + "pwoliye4");
            var msg = "Already Registered for claim";
            return res.render("index.ejs", { msg: msg });
          }

          // Create new Claim
          let newClaim;
          try {
            console.log(ad + "pwoliye5");
            newClaim = new Claim.fromCollection(ad)({
              name: req.body.name,
              wanumber: req.body.wanumber,
              img: req.body.img,
              url: req.body.url,
              uid: req.body.uid,
              wmid: req.body.wmid,
            });
          } catch (e) {
            console.log(e);
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
              console.log(e);
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
  var ad = req.originalUrl.split("/")[1];
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

router.get("/claim", (req, res) => {
  var url = req.originalUrl;
  res.render("claim.ejs", { url: url });
});

router.post("/claim", (req, res) => {
  var url = req.originalUrl;
  var ad = req.originalUrl.split("/")[1];
  console.log(req.body);
  Claim.fromCollection(ad)
    .findOne({ uid: req.body.uid })
    .then((doc) => {
      if (!(req.body.upi && req.body.uid)) {
        var msg = "Please Fill all the fields";
        return res.render("claim.ejs", { msg: msg, url: url });
      } else if (doc) {
        
        console.log(doc);
        doc.submitted = true;
        doc.upi = req.body.upi;
        doc.viewsurl = req.body.url;
        console.log("doc : ")
        console.log(doc)
        try {
          doc.save();
          var msg = "Claim Registered";

          return res.render("claim.ejs", { msg: msg, url: url });
        } catch (error) {
          return res.sendStatus(400)
        }
        // Claim.fromCollection(ad)
        //   .updateOne(
        //     {
        //       _id: val._id,
        //     },
        //     { submitted: true, upi: req.body.upi, viewsurl: req.body.url }
        //   )
        //   .then((v) => {
        //     var msg = "Claim Registered";

        //     return res.render("claim.ejs", { msg: msg ,url:url,green:true});
        //   })
        //   .catch((e) => {
        //     var msg = "An Error Occured Please Try Again";
        //   });
      } else {
        var msg = "Unique ID does not match any documents";
        return res.render("claim.ejs", { msg: msg, url: url });
      }
    });
});

router.get("/status", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  var url = req.originalUrl;
  res.render("status_check.ejs", { url: url, ad: ad });
});

router.post("/status", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  console.log(ad);
  var url = req.originalUrl;
  if (req.body.uid) {
    Claim.fromCollection(ad)
      .findOne({ uid: req.body.uid })
      .then((val) => {
        if (val) {
          console.log(val.submitted);
          res.render("track.ejs", {});
        } else {
          res.send("ID does not match any documents");
        }
      });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router;
