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

// Imgur
new Imgur({
  clientid: "59f06376fe068a7", //You can change this ClientID
  callback: feedback,
});

$("#submit-form").submit((e) => {
  var uid = $("#uid").val();

  var status = $("#status option:selected").text();
  var error = $("#error-message");
  var uploadurl = $("#url").val();
  var upi = $("#upi").val();
  var text;

  if (uploadurl.length == 0) {
    $("#error-message").css("padding", "13px");
    text = "Upload not completed";
    error.html(text);
    validate = false;
    return validate;
  } else if (upi.length == 0) {
    $("#error-message").css("padding", "13px");
    text = "Please Fill All feilds";
    error.html(text);
    validate = false;
    return validate;
  } else if (uid.length == 0) {
    $("#error-message").css("padding", "13px");
    text = "Upload not completed";
    error.html(text);
    validate = false;
    return validate;
  } else {
    $(".animation-container").addClass("loader-container");
    $(".animation").addClass("loader");
  }

  //   e.preventDefault();
  //     $.ajax({
  //         url:"https://script.google.com/macros/s/AKfycbxmSljKTguJ0Mez_smO52cDFPVDgPBs2e7Zs7is-X2nA1Gpha3n/exec",
  //         data:$("#submit-form").serialize(),
  //         method:"post",
  //         success:function (response){
  //             alert("Form submitted successfully");
  //             // window.location.reload();
  //             window.location.href="index.html";
  //         },
  //         error:function (err){
  //             alert(err);

  //         }
  //     });
});
