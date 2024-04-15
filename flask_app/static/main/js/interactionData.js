// JavaScript to capture user interactions
//
// Author: Aman Todi

// Define the global interaction data object
window.interactionData = {
    calculatorOperations: [],
    ratioSliderChanges: [],
    rectangleSelection: '',
  };

// Function to format date and time into a string
function getCurrentDateTime() {
    let now = new Date();

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based, add 1 to fix
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  
// Function to send data to the server
window.sendDataToServer = function() {
console.log('Sending data to server:', window.interactionData);
jQuery.ajax({
    url: '/track-interaction',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(window.interactionData),
    success: function(response) {
    console.log('Data sent successfully:', response);
    },
    error: function(xhr, status, error) {
    console.error('Failed to send interaction data to server:', status, error);
    }
});
};

// Function to handle page unload
window.addEventListener('beforeunload', function() {
window.sendDataToServer();
});
