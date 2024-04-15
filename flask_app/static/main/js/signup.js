// JavaScript to implement sign up
//
// Author: Aman Todi

const signup_btn = document.getElementById("signup_button");

signup_btn.addEventListener('click', function () {
    // Get user input from signup form
    var email = $('#email').val();
    var password = $('#password').val();
    var data = { email: email, password: password };

    // Send signup data to server
    jQuery.ajax({
        url: "/processsignup",
        data: data,
        type: "POST",
        success: function(returned_data){
            ret = JSON.parse(returned_data);
            if(ret.success) {
                window.location.href = '/login';
            } 
            else {
                $('#signup_error').text('Signup failed. User may already exist.');
            }
        }
    });
});

