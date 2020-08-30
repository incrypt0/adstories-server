var env = process.argv[2] || "dev";
var port = process.env.PORT || 8080;

switch (env) {
  case "dev":
    // Setup development config
    // dotenv config
    port = 3000;
    const dotenv = require("dotenv");
    dotenv.config();
    console.log("Running in dev mode");
    break;
  case "prod":
    // Setup production config
    break;
}

const express = require("express");
const { response } = require("express");
const app = express();
const Jimp = require("jimp");
const mongoose = require("mongoose");

const waterMarkImage = require("./imagegen");

// Routes
var adsRoute = require("./routes/ad/ad");
var claimAmountRoute = require("./routes/claim/claim_amount");
const Ad = require("./schemas/Ad");

// Static directory
app.use(express.static(__dirname + "/public"));

// Mongo URI
const db = require("./config/keys").mongoURI;
console.log(db);

// Connect to mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected successfully ${db}`);
  })
  .catch((err) => {
    console.log(`Unable to connect to the database ${err}`);
  });

// Setting ejs as view engine
app.set("view-engine", "ejs");

// json essentials
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middlewares
var adExistsMiddleWare = (req, res, next) => {
  console.log(req.originalUrl);
  var ad = req.originalUrl.split("/")[1];

  Ad.findOne({ name: ad })
    .then((v) => {
      if (!v) {
        return res.render("msg.ejs", {
          success: true,
          msg: "404 not found",
          heading: "",
        });
      } else {
        next();
      }
    })
    .catch((e) => {
      return res.render("msg.ejs", {
        success: true,
        msg: "An Error Occured Please Try Again",
        heading: "",
      });
    });
  return;
};
// Routes

// Claims route
app.use("/claim", claimAmountRoute);

// app.get("/track_test", (req, res) => {
//   res.render("track2.ejs", {
//     heading: "Claim Status",
//     msg: "Your claim has been verified and payment is under process",
//     submitted: true,
//     verified: true,
//     payment: false,
//     name: "Hari R U",
//     uid: "ABCDEFG",
//   });
// });


app.use("/:ad", adExistsMiddleWare, adsRoute);

// Root
app.get("/", (req, res) => {
  res.redirect("http://adstories.in");
});

app.listen(port, () => {
  console.log("listening on http://localhost:" + port);
});
