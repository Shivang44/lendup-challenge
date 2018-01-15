$('#mainForm').submit(function(e){
    e.preventDefault();
    var phone = $('#mainForm').find("input[name='phone']").val().trim();
    var delay = $('#mainForm').find("input[name='delay']").val().trim();

    function validateInputs() {
        // Some basic client side validation to see if phone number is 10 digits long
        if (!(/^\d{10}$/.test(phone))) {
            swal({
              title: "Phone number not valid",
              text: "Please enter a 10 digit phone number without any whitespace or other characters.",
              icon: "error",
            });
            return false;
        }


        // Also do client side validation on delay
        if (isNaN(parseInt(delay)) || delay != parseInt(delay, 10) ||  delay < 0 || delay > 1000) {
            swal({
              title: "Delay is not valid",
              text: "Please enter an integer delay value between 0 and 1000 minutes.",
              icon: "error",
            });
            return false;
        }

        return true;
    }


    if (validateInputs()) {
        // Number and delay is valid. Do an ajax call and display the relevant alert (call succcess or failure)
        $.ajax({
          type: "POST",
          url: "/phase3/callUser",
          data: {
              phone: phone,
              delay: delay
          },
          success: function(data) {
            console.log(data);
            swal({
              title: "Calling phone number in " + delay + " minutes.",
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
    }



});
