function downloadBase64File(base64Data, fileName) {
  const downloadLink = document.createElement("a");
  downloadLink.href = base64Data;
  console.log(base64Data)
  downloadLink.download = fileName;
  downloadLink.click();
}

// Axios Post request to watermark image
const waterMarkImage = () => {
  console.log("waterMarkCalled");
  const Url = window.location.href + "/watermark";
  axios({
    method: "post",
    url: Url,
  }).then((data) => {
    console.log(data);
    downloadBase64File(data,'Ad.jpg');
  });
};

// Verify Before download
document.getElementById("download").addEventListener("click", function () {
  const uri = window.location.href;
  const error = document.getElementById("error-message");
  const wanumber = document.getElementById("wanumber");
  const name = document.getElementById("name");

  const Data = {
    name: name.value,
    wanumber: wanumber.value,
  };
  console.log(wanumber.value.length !== 10 && name.value.length == 0);
  console.log(wanumber.value.length + " " + name.value.length);
  if (wanumber.value.length !== 10 && name.value.length == 0) {
    console.log("IN");
    error.innerText =
      "Please enter a name and a valid whatsapp number before downloading image";
  } else {
    wanumber.readOnly = true;
    name.readOnly = true;
    console.log("pyi makkale");
    waterMarkImage();
  }
});

// Imgur Kalikal
var feedback = function (res) {
  if (res.success === true) {
    var get_link = res.data.link.replace(/^http:\/\//i, "https://");
    document.querySelector(".status").classList.add("bg-success");
    document.getElementById("wait").innerHTML = "Uploaded Successfully";
    document.getElementById("wait").style.color = "green";
    document.getElementById("url").value = get_link;
  }
};

new Imgur({
  clientid: "59f06376fe068a7", //You can change this ClientID
  callback: feedback,
});
