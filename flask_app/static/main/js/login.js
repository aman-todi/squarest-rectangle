// JavaScript to implement login
//
// Author: Aman Todi

let count = 0;

const login_btn = document.getElementById("login_button");

login_btn.addEventListener('click', function () {
    // package data in a JSON object
    // Get user input
    var email = $('#email').val();
    var password = $('#password').val();
    var next = $('#next').val(); 
    var data_d = {email: email, password: password, next: next};
    console.log('data_d', data_d);

    // SEND DATA TO SERVER VIA jQuery.ajax({})
    jQuery.ajax({
        url: "/processlogin",
        data: data_d,
        type: "POST",
        success: function(returned_data){
            ret = JSON.parse(returned_data);
            if(ret.success) {
                window.location.href = ret.next;
            } 
            else {
                count++;
                $('#login_error').text('Login failed. Attempt: ' + count);
            }
        }
    });
});