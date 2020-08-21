const uri = window.location.href;
const error = document.getElementById("error-message");
const wanumber = document.getElementById("wanumber");
const name = document.getElementById("name");
var downloadLink = document.createElement("a");
downloadLink.setAttribute("id", "download-ad");
var clicked = false;
var downloadGenerated = false;

// Function Which downloads a base64 file
function downloadBase64File(base64Data, fileName) {
  clicked = true;

  console.log("clicked inside downloadb64: " + clicked);

  downloadLink.href = base64Data;
  downloadLink.download = fileName;

  if (base64Data === "") {
    clicked = !clicked;
  }

  downloadLink.click();
  downloadGenerated = !downloadGenerated;
}

// Axios Post request to watermark image
const waterMarkImage = () => {
  console.log("waterMarkCalled");
  const Url = window.location.href + "/watermark";
  axios({
    method: "post",
    url: Url,
  }).then((resp) => {
    downloadBase64File(resp.data, "ad.jpg");
  });
};

// Verify Before download
document.getElementById("download").addEventListener("click", function () {
  if (!clicked) {
    clicked = !clicked;

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
      console.log("poyi makkale");
      waterMarkImage();
    }
  } else {
    if (downloadGenerated) {
      downloadLink.click();
    } else {
      error.innerText = "Click the download button only once";
      setTimeout(() => {
        error.innerText = "";
      }, 4 * 1000);
    }
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
