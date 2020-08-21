const Jimp = require("jimp");

var fileName = "public/images/poster.jpg";
var imageCaption = "Image caption";
var loadedImage;

var waterMarkImage = async (fileName)  => {
    var buff;
    var base64;
    var img = await Jimp.read(fileName)
    var font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
    await img.print(font,20,20,imageCaption).getBase64(Jimp.MIME_JPEG,(err,src)=>{
        base64=src
    })
 
 return base64
};

module.exports = waterMarkImage;
