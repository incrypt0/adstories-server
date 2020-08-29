// Id selectors
const error = document.getElementById("error-message");
const wanumber = document.getElementById("wanumber");
const name = document.getElementById("name");
const animation_container = document.querySelector(".animation-container");
var form = document.getElementById("submit-form");
const claimBtn = document.getElementById("claim-btn");
const uploadUrl = document.getElementById("url");

// Query Selectors
const animation = document.querySelector(".animation");

// Other required variables
const uri = window.location.href;
var downloadLink = document.createElement("a");
var canvas = document.createElement("canvas");
downloadLink.setAttribute("id", "download-ad");

// Booleans
var clicked = false;
var downloadGenerated = false;

// UID variables
var uid;
var wmid;

// Verify Before download
document.getElementById("download").addEventListener("click", function () {
  if (!clicked) {
    runLoaderAnimation();
    clicked = !clicked;

    if (wanumber.value.length !== 10 && name.value.length == 0) {
      console.log("IN");
      error.innerText =
        "Please enter a name and a valid whatsapp number before downloading image";
      clicked = !clicked;
      stopLoaderAnimation();
    } else {
      error.innerText = "";
      wanumber.readOnly = true;
      name.readOnly = true;
      var data = {
        name: name.value,
        wanumber: wanumber.value,
      };

      waterMarkImage(data);
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

// Run the  Loader animation
function runLoaderAnimation() {
  console.log("loader started");
  animation_container.classList.add("loader-container");
  animation.classList.add("loader");
}

// Stop the  Loader animation
function stopLoaderAnimation() {
  console.log("loader ended");
  animation_container.classList.remove("loader-container");
  animation.classList.remove("loader");
}

// Axios Post request to watermark image
const waterMarkImage = (data) => {
  console.log("waterMarkCalled");
  const Url = window.location.href + "/watermark";
  axios({
    method: "post",
    url: Url,
    data: { data },
  })
    .then((resp) => {
      console.log(resp.data);
      if (resp.data.success) {
        uid = resp.data.uid;
        wmid = resp.data.wmid;
       
        console.log("reached just before download base64");
        // downloadBase64File(resp.data.buffer, "ad.jpg");
        watermarkPrinter(wmid, uid);
      }
    })
    .catch((err) => {
      clicked = false;
      error.innerText = "Check Network Connection";
    });
};

// Function Which downloads a base64 file
function downloadBase64File(base64Data, fileName) {
  clicked = true;
  downloadLink.href = base64Data;
  downloadLink.download = fileName;

  stopLoaderAnimation();
  console.log("loader stopped");
  if (base64Data === "") {
    clicked = !clicked;
  } else {
    downloadLink.click();
    console.log("clicked generated download");
    console.log(downloadLink);
    downloadGenerated = !downloadGenerated;
  }
}

// SubmitForm
claimBtn.addEventListener("click", (e) => {
  runLoaderAnimation();
  e.preventDefault();
  if (uploadUrl.length == 0) {
    error.innerText = text = "Upload not completed";
    s;
    stopLoaderAnimation();
  } else {
    createUidsInput(uid, wmid);
    stopLoaderAnimation();
  }
});

// Create hidden form inputs for uid and wmuid
function addToForm(inputKey, inputValue) {
  var input = document.createElement("input");
  input.classList.add("hidden-input"); //prepare a new input DOM element
  input.setAttribute("name", inputKey); //set the param name
  input.setAttribute("value", inputKey); //set the value
  input.setAttribute("type", "hidden");
  input.value = inputValue;
  form.appendChild(input);
  form.submit();
}

// Appending hidden inputs to document
function createUidsInput(uid, wmuid) {
  if (uid && wmuid) {
    addToForm("uid", uid);
    addToForm("wmid", wmuid);
    form.submit();
  } else {
    error.innerHTML = "Please download the file before clicking submit";
  }
}

// Watermark Worker
watermarkPrinter = (watermark, uid) => {
  console.log("watermarPrinter called");
  // Config
  var img = document.getElementById("baseImg");
  var canvas = document.getElementById("waterMarkCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  // Drawing part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.font = "60px Ariel";
  ctx.fillStyle = "white";
  ctx.fillText(watermark, 80, 80);

  // Download link
  var a = document.createElement("a");
  a.download = `${uid}.png`;
  var dataUrl = canvas.toDataURL("image/png");
  a.href = dataUrl;
  a.click();
};
