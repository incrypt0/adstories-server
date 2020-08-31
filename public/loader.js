var page = 2;
document.querySelectorAll("#loader").forEach((item) => {
  item.addEventListener("click", (event) => {
    const loading =
      '<div class="spinner-border spinner-border-sm text-primary" role="status"><span class="sr-only">Loading...</span></div>';
    var boolVal = item.innerText;

    item.innerHTML = loading;

    getUpdates(item);
  });
});
var table = document
  .getElementById("data-table")
  .getElementsByTagName("tbody")[0];

function htmlGen(ele) {
  return `<tr>
          <td> ${ele.name}</td>
          <td> ${ele.uid}</td>
          <td> ${ele.wmid} </td>
          <td> ${ele.wanumber}</td>
          <td> ${ele.upi ?? ""}</td>
            
            <td> <img id="clip" src="${
              ele.url
            }" width="50%"></img><div class="container"> </div </td>
            <td> <img id="clip" src="${
              ele.viewsurl
            }" width="50%"></img><div class="container"> </div </td>
          <td>
          <button
          class="btn btn-sm rounded decider ${
            ele.submitted ? "btn-success" : "btn-danger"
          }"
          val="submitted"
          dbid="${ele._id}"
        >
    ${ele.submitted}
        </button>
        </td>
        <td>
        <button
        class="btn btn-sm rounded decider ${
          ele.verified ? "btn-success" : "btn-danger"
        }"
        val="verified"
        dbid="${ele._id}"
      >
  ${ele.verified}
      </button>
      </td>
      <td>
      <button
      class="btn btn-sm rounded decider ${
        ele.verified ? "btn-success" : "btn-danger"
      }"
      val="payment"
      dbid="${ele._id}"
    >
${ele.payment}
    </button>
          </td>
          </tr>`;
}
function getUpdates(item) {
  console.log(page);
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`pagesapi/?page=${page++}&limit=20`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      item.innerHTML = "Load More";
      result = JSON.parse(result);
      console.log(result);
      if (result.success) {
        result.docs.forEach((ele) => {
          //  console.log(ele)
          table.innerHTML += htmlGen(ele);
        });
        deciderListener();
      }
    })
    .catch((error) => {
      console.log("error", error);
      item.innerHTML = "Load More";
    });
}
