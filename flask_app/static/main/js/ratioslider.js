// JavaScript to implement the ratio sliders
//
// Author: Aman Todi

document.addEventListener('DOMContentLoaded', function() {
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    const value1 = document.getElementById('value1');
    const value2 = document.getElementById('value2');
    const ratioDisplay = document.getElementById('ratio');

    // Function to update the slider values and display
    function updateValues() {
        value1.textContent = slider1.value;
        value2.textContent = slider2.value;
        calculateRatio();
    }

    // Function to calculate and display the ratio
    function calculateRatio() {
        let ratio = 1;
        if (parseInt(slider2.value) !== 0) {
            ratio = parseInt(slider1.value) / parseInt(slider2.value);
        }
        ratioDisplay.textContent = ratio.toFixed(2) + " : 1";
    }

    // Function to record slider changes when user stops adjusting
    function recordSliderChange() {
        window.interactionData.ratioSliderChanges.push({
            time: getCurrentDateTime(),
            slider1: slider1.value, 
            slider2: slider2.value,
            ratio: ratioDisplay.textContent
        });
    }

    // Attach event listeners to sliders for real-time update
    slider1.addEventListener('input', updateValues);
    slider2.addEventListener('input', updateValues);

    // Attach change event listeners to sliders for tracking when adjustment stops
    slider1.addEventListener('change', recordSliderChange);
    slider2.addEventListener('change', recordSliderChange);

    // Perform initial calculation and tracking setup
    updateValues();
});

