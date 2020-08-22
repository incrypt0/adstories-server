const Jimp = require("jimp");

var fileName = "public/images/poster.jpg";

var loadedImage;

var waterMarkImage = async (fileName,watermarkText) => {
  var buff;
  var base64;
  
  var img = await Jimp.read(fileName);
  var font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  base64 = await img
    .print(font, 20, 20, watermarkText)
    .getBase64Async(Jimp.MIME_JPEG);

  return base64;
};

module.exports = waterMarkImage;
