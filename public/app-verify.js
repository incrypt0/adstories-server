$("#submit-form").submit((e)=>{   
    // var name = $("#fname").val();

    console.log("Submission eventeeeeeeyyyy")
    var status = $("#status option:selected").text();
    var error = $("#error-message");
    var uploadurl = $("#url").val();
    // var num= $("#number").val();
    var text;



   
    if(uploadurl.length == 0) {
        $("#error-message").css("padding", "13px");
        text = "Upload not completed";
        error.html(text);
        validate = false;
        return validate;
    }

    else{
        $(".animation-container").addClass("loader-container");
        $(".animation").addClass("loader");

    }

    



    e.preventDefault();
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
