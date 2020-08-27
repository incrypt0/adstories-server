document.querySelectorAll(".decider").forEach((item) => {
  item.addEventListener("click", (event) => {
    const loading =
      '<div class="spinner-border spinner-border-sm text-primary" role="status"><span class="sr-only">Loading...</span></div>';
    var boolVal = item.innerText;

    item.innerHTML = loading;
    const type = item.attributes.val.value;
    const dbid = item.attributes.dbid.value;
    postUpdate(type, dbid, item, boolVal);
  });
});

function postUpdate(type, dbid, item, boolVal) {
  var myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  var dataVal = !(boolVal.toLowerCase() == "true");

  var reqOptions = {};
  reqOptions[type] = dataVal;
  reqOptions.dbid = dbid;
  var raw = JSON.stringify(reqOptions);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("update", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      console.log(`success : ${result["success"]}`);
      if (result.success) {
        console.log(result);
        if (result[type]) {
          item.innerHTML = result[type];
          item.classList.remove("btn-danger");
          item.classList.add("btn-success");
        } else {
          item.innerHTML = result[type];
          item.classList.remove("btn-success");
          item.classList.add("btn-danger");
        }
      }
    })
    .catch((error) => console.log("error", error));
}
