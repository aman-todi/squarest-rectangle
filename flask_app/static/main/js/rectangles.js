// JavaScript to implement display and selection of rectangle dimensions
//
// Author: Aman Todi

document.addEventListener('DOMContentLoaded', function() {
    // Attach click event listeners to rectangle options
    document.querySelectorAll('.rectangle').forEach(rectangle => {
        rectangle.addEventListener('click', function() {
            const selected = this.getAttribute('dimensions');
            selectRectangle(selected);
        });
    });
});

function selectRectangle(selected) {
    const messageContainer = document.getElementById('message-container');
    
    // Update interactionData with the selected rectangle
    window.interactionData.rectangleSelection = selected;
    
    if (selected === '37x40') {
        messageContainer.textContent = "You picked the right rectangle. 37 feet by 40 feet is the squarest rectangle.";
        messageContainer.className = "correct";
    } 
    else {
        messageContainer.textContent = "You picked the wrong rectangle. 37 feet by 40 feet is the squarest rectangle.";
        messageContainer.className = "incorrect";
    }

    window.sendDataToServer(window.interactionData);
}
