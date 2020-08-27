const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");
const ClaimConstructor = require("../../schemas/Claim");
const { generate } = require("shortid");
const { response } = require("express");

const Claim = new ClaimConstructor();

// Mock Ads <Development only>
var adList = ["adstories", "santoor", "chandrika"];

//
//
//
/**
 * @route GET /:ad
 * @desc Claimin ad
 * @access Public
 */
//
//
//

// Ads Route
router.get("/", (req, res) => {
  console.log(req.originalUrl);
  var ad = req.originalUrl.split("/")[1];
  if (adList.includes(ad)) res.render("index.ejs", { ad: ad });
  else res.send("404 page note found");
});

//
//
//
/**
 * @route POST /:ad
 * @desc Register Claim
 * @access Public
 */
//
//
//

// Unique ID generation
router.post("/", (req, res) => {
  var ad = req.originalUrl.split("/")[1];

  // Check whether unique id already exist
  Claim.fromCollection(ad)
    .findOne({
      uid: req.body.uid,
    })
    .then((user) => {
      if (user) {
        var msg = "Claim Registered";
        return res.render("index.ejs", {
          msg: msg,
          ad: ad,
          bgcolor: "green",
          color: "white",
        });
      }

      // Check whether wmid already exist
      Claim.fromCollection(ad)
        .findOne({
          wmid: req.body.wmid,
        })
        .then((user) => {
          var ad = req.originalUrl.split("/")[1];

          if (user) {
            console.log(ad + "pwoliye4");
            var msg = "Already Registered for claim";
            return res.render("index.ejs", {
              ad: ad,
              msg: msg,
              bgcolor: "#f19898",
              color: "black",
            });
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
            return res.render("index.ejs", {
              ad: ad,
              msg: "Already Registered for claim",
              bgcolor: "#f19898",
              color: "black",
            });
          }

          //  Save claim to database
          newClaim
            .save()
            .then((claim) => {
              console.log("ayoo");
              var heading = "Your Unique ID  IS";
              var msg = req.body.uid;

              return res.render("msg.ejs", {
                success: true,
                msg: msg,
                heading: heading,
              });
            })
            .catch((e) => {
              console.log(e);
              var msg = "An error occured please try again";
              return res.render("index.ejs", {
                ad: ad,
                msg: msg,
                bgcolor: "#f19898",
                color: "black",
              });
            });
        });
    });
});

//
//
//
/**
 * @route POST /:ad/watermark
 * @desc Watermark and unique id generation
 * @access Public
 */
//
//
//

// Watermark and Unique ID Generation
router.post("/watermark", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  var uid = req.body.uid;
  var wmid = req.body.wmid;
  //
  // Generate unique ID's
  var watermarkText = shortid.generate();
  var uid = shortid.generate();
  var generated = false;
  var uidGenerator = () => {
    console.log("running uidGenerator");
    if (!generated) {
      uid = shortid.generate();
      watermarkText = shortid.generate();
      Claim.fromCollection(ad)
        .findOne({ uid: uid })
        .then((val) => {
          console.log("Checking if uid exists");
          if (val) {
            console.log("uid exists");
            uidGenerator();
          } else {
            Claim.fromCollection(ad)
              .findOne({ wmid: wmid })
              .then((val) => {
                console.log("Checking if wmid exists");
                if (val) {
                  console.log("wmid exists");
                  uidGenerator();
                } else {
                  console.log("Ellam Set");
                  generated = true;
                }
                return;
              });
          }
          return;
        });
      return;
    }
  };

  uidGenerator();

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

//
//
//
/**
 * @route GET /:ad/claim
 * @desc Claim Amount Page
 * @access Public
 */
//
//
//

router.get("/claim", (req, res) => {
  var url = req.originalUrl;
  res.render("claim.ejs", { url: url });
});

//
//
//
/**
 * @route POST /:ad/claim
 * @desc Claim Amount Page
 * @access Public
 */
//
//
//

router.post("/claim", (req, res) => {
  var url = req.originalUrl;
  var ad = req.originalUrl.split("/")[1];

  console.log(req.body);

  // Find the claim if it exists
  Claim.fromCollection(ad)
    .findOne({ uid: req.body.uid })
    .then((doc) => {
      if (!(req.body.upi && req.body.uid)) {
        //
        //
        var msg = "Please Fill all the fields";
        return res.render("claim.ejs", { msg: msg, url: url });
        //
        //
      } else if (doc) {
        //
        //
        //
        if (doc.submitted === true) {
          var msg = "Claim Updated with new details";
          return res.render("claim.ejs", { msg: msg, url: url });
        }
        //
        //
        //
        doc.submitted = true;
        doc.upi = req.body.upi;
        doc.viewsurl = req.body.url;
        console.log("doc : ");
        console.log(doc);

        try {
          // Try to save the modified document
          //
          doc
            .save()
            .then((val) => {
              //
              var msg = "Claim Registered";
              return res.render("claim.ejs", { msg: msg, url: url });
              //
            })
            .catch((e) => {
              //
              var msg = "An error occured please reload and resend your info.";
              return res.render("claim.ejs", { msg: msg, url: url });
              //
            });
        } catch (error) {
          //
          return res.sendStatus(400);
          //
        }
      } else {
        //
        var msg = "Unique ID does not match any documents";
        return res.render("claim.ejs", { msg: msg, url: url });
        //
      }
    });
});

//
//
//
/**
 * @route GET /:ad/claim
 * @desc Get status of claim
 * @access Public
 */
//
//
//

router.get("/status", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  var url = req.originalUrl;
  res.render("status_check.ejs", { url: url, ad: ad });
});

//
//
//
/**
 * @route POST /:ad/claim
 * @desc Post UID to get status
 * @access Public
 */
//
//
//

router.post("/status", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  console.log(ad);
  var url = req.originalUrl;
  if (req.body.uid) {
    Claim.fromCollection(ad)
      .findOne({ uid: req.body.uid })
      .then((val) => {
        if (val) {
          var submitted = "";
          var verified = "";
          var payment = "";
          var msg = "";
          if (val.submitted) {
            submitted = "active";
            msg = "You claim has been submitted and is awaiting verification";
          }
          if (val.submitted && val.verified) {
            submitted = "done";
            verified = "active";
            msg = "You claim has been verified and is awaiting payment";
          }

          if (val.payment) {
            payment = "active";
            verified = "done";
            msg =
              "Your payment has been proccessed .If you havent recieved it please contact us.";
          }

          res.render("track.ejs", {
            heading: "Status of your claim",
            submitted,
            verified: verified,
            payment: payment,
            msg: msg,
          });
        } else {
          res.send("ID does not match any documents");
        }
      });
  } else {
    res.sendStatus(404);
  }
});

//
//
//
/**
 * @route get /:ad/page
 * @desc Only for admins
 * @access admins
 */
//
//
//

router.get("/page", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  const options = {
    page: 1,
    limit: 10,
    collation: {
      locale: "en",
    },
  };
  Claim.fromCollection(ad)
    .paginate({}, options)
    .then((val) => {
      var result = val.docs;
      console.log(result[0]);
      if (result) {
        return res.render("pages.ejs", { results: result });
      }
      return res.json(val);
    });
});

//
//
//
/**
 * @route POST /:ad/page
 * @desc Only for admins
 * @access admins
 */
//
//
//

router.post("/update", (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  if (req.body) {
    console.log(req.body.dbid)
    Claim.fromCollection(ad)
      .findById(req.body.dbid)
      .then((doc) => {
        
        
          doc.submitted = req.body.submitted??doc.submitted;
    
          doc.verified = req.body.verified??doc.verified;
       
          doc.payment = req.body.verified??doc.payment;
       
        doc
          .save()
          .then((e) => {
            console.log("blah")
            console.log(e);
            console.log("blah")
            return res.json({
              success: true,
              submitted:e.submitted,
              verified:e.verified,
              payment:e.payment,
              uid:e.uid,
            });
          })
          .catch((e) => {
            return res.json({
              success: false,
              
            });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.json({
          success: false,
        });
      });
  }
});

module.exports = router;
