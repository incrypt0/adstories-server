const Jimp = require("jimp");

var fileName = "public/images/poster.jpg";
var imageCaption = "Image caption";
var loadedImage;

var waterMarkImage = async (fileName) => {
  var buff;
  var base64;
  var img = await Jimp.read(fileName);
  var font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  base64 = await img
    .print(font, 20, 20, imageCaption)
    .getBase64Async(Jimp.MIME_JPEG);

  return base64;
};

module.exports = waterMarkImage;
