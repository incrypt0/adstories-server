const express = require("express");
const waterMarkImage = require("../../imagegen");
const router = express.Router();
const shortid = require("shortid");
const ClaimConstructor = require("../../schemas/Claim");
const TempConstructor = require("../../schemas/Temp");
const { generate } = require("shortid");
const { response } = require("express");
const { customAlphabet } = require("nanoid");

const redis = require("../../tools/redis");
const { client } = require("../../tools/redis");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);
const Claim = new ClaimConstructor();
const Temp = new TempConstructor();

// Mock Ads <Development only>
var adList = ["adstories", "santoor", "chandrika"];

// Redis
redis.on("error", (e) => {
  console.log(e);
});

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
// router.get("/", (req, res) => {
//   console.log(req.originalUrl);
//   var ad = req.originalUrl.split("/")[1];
//   if (adList.includes(ad)) res.render("index.ejs", { ad: ad });
//   else res.send("404 page note found");
// });

//
router.get("/", (req, res) => {
  console.log(`get request into ${req.originalUrl}`);
  var ad = req.originalUrl.split("/")[1];

  res.render("index.ejs", { ad: ad });
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
  
  if (req.body.uid && req.body.wmid) {
    redis.exists(req.body.uid, (err, reply) => {
      if (reply === 1) {
        console.log("uid exists in redis");
        Claim.fromCollection(ad)
          .findOne({
            uid: req.body.uid,
          })
          .then((user) => {
            if (user) {
              var msg = `Already Registered for claim with UID : ${user.uid} `;
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
      } else {
        console.log("uid doesn't exist");
        var msg = "An error occured please try again";
        return res.render("index.ejs", {
          ad: ad,
          msg: msg,
          bgcolor: "#f19898",
          color: "black",
        });
      }
    });

    // Check whether unique id already exist
  }
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
router.post("/watermark", async (req, res) => {
  var ad = req.originalUrl.split("/")[1];
  console.log("begining");
  //
  // Generate unique ID's
  var wmid = "";
  var uid = "";
  var generated = false;
  var i = 0;
  var data = {
    success: false,
  };
  // wmid = "hi";
  // uid = "hi";
  var uidGenerator = async () => {
    console.log("running uidGenerator");

    wmid = await nanoid();
    uid = await nanoid();
    console.log(i);
    if (!generated) {
      if (i < 10) {
        i++;

        Claim.fromCollection(ad)
          .findOne({ uid: uid })
          .then((val) => {
            console.log("Checking if uid exists");
            if (val) {
              console.log("uid exists");

              return uidGenerator();
            } else {
              Claim.fromCollection(ad)
                .findOne({ wmid: wmid })
                .then((val) => {
                  console.log("Checking if wmid exists");
                  if (val) {
                    console.log("wmid exists");
                    return uidGenerator();
                  } else {
                    console.log("Final Unique ID Generated");
                    generated = true;
                    data = {
                      success: true,
                      wmid: wmid,
                      uid: uid,
                    };
                    generated = true;

                    //
                    // Saving key to redis
                    redis.set(uid, wmid);
                    redis.expire(uid, 60 * 2);
                    console.log("Saved UID TO REDIS");
                    //
                    //

                    console.log("________________2________________");
                    return res.json(data);
                  }
                })
                .catch((e) => {
                  console.log(e);
                  data = {
                    success: false,
                  };
                  console.log("________________1________________");
                  return res.json(data);
                });
            }
          });
      } else {
        console.log("exceeded 10");
        var data = {
          success: false,
        };
        console.log("________________3________________");
        return res.json(data);
      }
    } else {
      var data = {
        success: false,
      };
      console.log("________________6________________");
      return res.json(data);
    }
  };

  await uidGenerator();

  // Watermark the ad
  // waterMarkImage("public/images/poster.jpg", wmid)
  //   .then((buf) => {
  //     console.log("watermarked");
  //     var data;
  //     if (buf) {
  //       data = {
  //         success: true,
  //         buffer: buf,
  //         wmid: wmid,
  //         uid: uid,
  //       };
  //     } else {
  //       data = {
  //         success: false,
  //       };
  //     }
  //     console.log("watermarked");
  //     return res.json(data);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     var data = {
  //       success: false,
  //       msg: "Cannot generate download please try again later.",
  //     };
  //     return res.json({ data: data });
  //   });
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
  if (req.body.uid) {
    req.body.uid = req.body.uid.trim();
  }
  // Find the claim if it exists
  Claim.fromCollection(ad)
    .findOne({ uid: req.body.uid })
    .then((doc) => {
      var msg;
      if (!(req.body.upi && req.body.uid)) {
        //
        //
        msg = "Please Fill all the fields";
        return res.render("claim.ejs", {
          msg: msg,
          url: url,
          color: "#f19898",
        });
        //
        //
      } else if (doc) {
        //
        //
        //
        var alreadySubmitted = doc.submitted;

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
              if (alreadySubmitted === true) {
                msg = "Claim Updated with new details";
                color = "green";
                return res.render("claim.ejs", {
                  msg: msg,
                  url: url,
                  color: "green",
                });
              }
              //
              msg = "Claim Registered";
              return res.render("claim.ejs", {
                msg: msg,
                url: url,
                color: "green",
              });
              //
            })
            .catch((e) => {
              //
              console.log(e);
              msg = "An error occured please reload and resend your info.";
              return res.render("claim.ejs", {
                msg: msg,
                url: url,
                color: "#f19898",
              });
              //
            });
        } catch (e) {
          //
          console.log(e);
          msg = "An error occured please reload and resend your info.";
          return res.render("claim.ejs", {
            msg: msg,
            url: url,
            color: "#f19898",
          });
          //
        }
      } else {
        //
        msg = "Unique ID does not match any documents";
        return res.render("claim.ejs", {
          msg: msg,
          url: url,
          color: "#f19898",
        });
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
    req.body.uid = req.body.uid.trim();
    Claim.fromCollection(ad)
      .findOne({ uid: req.body.uid })
      .then((val) => {
        if (val) {
          var submitted = val.submitted;
          var verified = val.verified;
          var payment = val.payment;
          var msg = "";

          res.render("track2.ejs", {
            heading: "Status of your claim",
            submitted: submitted,
            verified: verified,
            payment: payment,
            uid: val.uid ?? "",
            name: val.name ?? "",
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
        var urlGen = () => {
          var urlList = result.url.split(".");
          urlList[2] = urlList[2] + "m";

          urlList.join(".");
        };

        return res.render("pages.ejs", { results: result, urlGen: urlGen });
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
    console.log(req.body.dbid);
    Claim.fromCollection(ad)
      .findById(req.body.dbid)
      .then((doc) => {
        console.log("hi");
        if (doc) {
          console.log("doc exists");
          if (req.body.type == "submitted") {
            doc.submitted = req.body.submitted;
          } else if (req.body.type == "verified") {
            doc.verified = req.body.verified;
          } else if (req.body.type == "payment") {
            doc.payment = req.body.payment;
          } else {
            return res.json({
              success: false,
            });
          }

          doc
            .save()
            .then((e) => {
              console.log("blah");
              console.log(e);
              console.log("blah");
              return res.json({
                success: true,
                submitted: e.submitted,
                verified: e.verified,
                payment: e.payment,
                uid: e.uid,
              });
            })
            .catch((e) => {
              return res.json({
                success: false,
              });
            });
        } else {
          console.log("doc dont exists");
          return res.json({
            success: false,
          });
        }
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
