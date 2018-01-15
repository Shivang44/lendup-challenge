$('#submitButton').click(function(e){
    e.preventDefault();
    var phone = $('#mainForm').find("input[name='phone']").val().trim();

    // Some basic client side validation to see if phone number is 10 digits long
    if (/^\d{10}$/.test(phone)) {

        // Number is valid. Do an ajax call and display the relevant alert (call succcess or failure)
        $.ajax({
          type: "POST",
          url: "/phase2/callUser",
          data: {
              phone: phone
          },
          success: function(data) {
            console.log(data);
            swal({
              title: "Calling phone number!",
              icon: "success",
            });
          },
          error: function(error) {
              swal({
                title: "An error occured",
                icon: "error",
                text: "We could not call your number. Please try again later."
              });
          }
        });


    } else {
        swal({
          title: "Phone number not valid",
          text: "Please enter a 10 digit phone number without any whitespace or other characters.",
          icon: "error",
        });
    }

});
