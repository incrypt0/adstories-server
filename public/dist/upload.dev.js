"use strict";

// Id selectors
var error = document.getElementById("error-message");
var wanumber = document.getElementById("wanumber");
var name = document.getElementById("name");
var animation_container = document.querySelector(".animation-container");
var form = document.getElementById("submit-form");
var claimBtn = document.getElementById("claim-btn");
var uploadUrl = document.getElementById("url"); // Query Selectors

var animation = document.querySelector(".animation"); // Other required variables

var uri = window.location.href;
var downloadLink = document.createElement("a");
downloadLink.setAttribute("id", "download-ad"); // Booleans

var clicked = false;
var downloadGenerated = false; // UID variables

var uid;
var wmid; // Verify Before download

document.getElementById("download").addEventListener("click", function () {
  if (!clicked) {
    runLoaderAnimation();
    clicked = !clicked;
    console.log(wanumber.value.length !== 10 && name.value.length == 0);
    console.log(wanumber.value.length + " " + name.value.length);

    if (wanumber.value.length !== 10 && name.value.length == 0) {
      console.log("IN");
      error.innerText = "Please enter a name and a valid whatsapp number before downloading image";
      clicked = !clicked;
      stopLoaderAnimation();
    } else {
      error.innerText = "";
      wanumber.readOnly = true;
      name.readOnly = true;
      var data = {
        name: name.value,
        wanumber: wanumber.value
      };
      console.log("data is :");
      console.log(data);
      waterMarkImage(data);
    }
  } else {
    if (downloadGenerated) {
      downloadLink.click();
    } else {
      error.innerText = "Click the download button only once";
      setTimeout(function () {
        error.innerText = "";
      }, 4 * 1000);
    }
  }
}); // Run the  Loader animation

function runLoaderAnimation() {
  console.log("loader started");
  animation_container.classList.add("loader-container");
  animation.classList.add("loader");
} // Stop the  Loader animation


function stopLoaderAnimation() {
  console.log("loader ended");
  animation_container.classList.remove("loader-container");
  animation.classList.remove("loader");
} // Axios Post request to watermark image


var waterMarkImage = function waterMarkImage(data) {
  console.log("waterMarkCalled");
  var Url = window.location.href + "/watermark";
  axios({
    method: "post",
    url: Url,
    data: {
      data: data
    }
  }).then(function (resp) {
    uid = resp.data.uid;
    wmid = resp.data.wmid;
    console.log(uid + " : " + resp.data.uid);
    console.log(wmid);
    downloadBase64File(resp.data.buffer, "ad.jpg");
  })["catch"](function (err) {
    clicked = false;
    error.innerText = "Check Network Connection";
  });
}; // Function Which downloads a base64 file


function downloadBase64File(base64Data, fileName) {
  clicked = true;
  console.log("clicked inside downloadb64: " + clicked);
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
} // SubmitFOrm


claimBtn.addEventListener("click", function (e) {
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
}); // Create hidden form inputs for uid and wmuid

function addToForm(inputKey, inputValue) {
  var input = document.createElement("input");
  input.classList.add("hidden-input"); //prepare a new input DOM element

  input.setAttribute("name", inputKey); //set the param name

  input.setAttribute("value", inputKey); //set the value

  input.setAttribute("type", "hidden");
  input.value = inputValue;
  form.appendChild(input);
  form.submit();
} // Appending hidden inputs to document


function createUidsInput(uid, wmuid) {
  if (uid && wmuid) {
    addToForm("uid", uid);
    addToForm("wmid", wmuid);
    form.submit();
  } else {
    error.innerHTML = "Please download the file before clicking submit";
  }
} // // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
// // Tests
// document.getElementById("download").addEventListener("click", function () {
//   console.log("Clicked Download");
//   var data = {
//     name: "Krishnanand",
//     wanumber: "7034320441",
//   };
//   console.log("data is :");
//   console.log(data);
//   waterMarkImage(data);
// })
// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Imgur Kalikal


var feedback = function feedback(res) {
  if (res.success === true) {
    var get_link = res.data.link.replace(/^http:\/\//i, "https://");
    document.querySelector(".status").classList.add("bg-success");
    document.getElementById("wait").innerHTML = "Uploaded Successfully";
    document.getElementById("wait").style.color = "green";
    document.getElementById("url").value = get_link;
  }
}; // Imgur


new Imgur({
  clientid: "59f06376fe068a7",
  //You can change this ClientID
  callback: feedback
});