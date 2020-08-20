var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        document.querySelector('.status').classList.add('bg-success');
        document.getElementById("wait").innerHTML = "Uploaded Successfully";
        document.getElementById("wait").style.color = "green";
        document.getElementById("url").value= get_link;
        //document.querySelector('.status').innerHTML =
           // 'Image : ' + '<br><input class="image-url" value=\"' + get_link + '\"/>' + '<img class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/>';
    }
};

new Imgur({
    clientid: '59f06376fe068a7', //You can change this ClientID
    callback: feedback
});