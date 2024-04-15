// JavaScript to display a feedback form
//
// Author: Aman Todi

// Display feedback form when the feedback button is clicked
const feedback_button = document.getElementById('feed_button');
const input_container = document.querySelector('.user_input');


feedback_button.addEventListener('click', function () {
    // Display the form if it wasn't displayed
    if (input_container.style.display === "flex") {
        input_container.style.display = "none";
    } 
    // Hide the form
    else {
        input_container.style.display = "flex";
    }
});