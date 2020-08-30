// Imgur Kalikal
var feedback = function (res) {
    
  // Stop the  Loader animation
  stopLoaderAnimation();
  if (res.success === true) {
    var get_link = res.data.link.replace(/^http:\/\//i, "https://");
    document.querySelector(".status").classList.add("bg-success");
    document.getElementById("wait").innerHTML = "Uploaded Successfully";
    document.getElementById("wait").style.color = "green";
    document.getElementById("url").value = get_link;
  }else{
    document.getElementById("wait").innerHTML = "Upload Failed Please try again";
    document.getElementById("wait").style.color = "red";
  }
};
function stopLoaderAnimation() {
  console.log("loader ended");
  animation_container.classList.remove("loader-container");
  animation.classList.remove("loader");
}
// Imgur
new Imgur({
  clientid: "59f06376fe068a7", //You can change this ClientID
  callback: feedback,
});
