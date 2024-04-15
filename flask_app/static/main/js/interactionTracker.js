// JavaScript to implement monitoring and collection of user interactions
//
// Author: Aman Todi

document.addEventListener('DOMContentLoaded', function() {
    // Variable to store interaction data
    const interactionData = {
        calculatorOperations: [],
        ratioSliderChanges: [],
        rectangleSelection: '',
        timeSpent: {
            calculator: 0,
            ratioSlider: 0,
            rectangleSelection: 0
        }
    };

    // Helper function to send data to the server
    function sendDataToServer(data) {
        console.log('Sending data to server:', data); // Debugging log
        jQuery.ajax({
            url: '/track-interaction',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log('Data sent successfully:', response);
                // Handle success response if needed
            },
            error: function(xhr, status, error) {
                console.error('Failed to send interaction data to server.', error);
            }
        });
    }

    // Track time spent in each section
    let activeSectionStartTime = Date.now();
    let activeSection = 'none';

    function switchSection(newSection) {
        if (activeSection !== 'none') {
            interactionData.timeSpent[activeSection] += Date.now() - activeSectionStartTime;
            console.log('Time spent in section', activeSection, ':', timeSpentInSection);
        }
        activeSection = newSection;
        activeSectionStartTime = Date.now();
    }

    // Check if the original functions are defined before overriding
    if (typeof calculate !== 'undefined') {
        const originalCalculate = calculate;
        calculate = function() {
            console.log('Calculator used with operation:', currentOperation, 'and input:', currentInput);
            originalCalculate.apply(this, arguments);
            interactionData.calculatorOperations.push(currentOperation + ' ' + currentInput);
            switchSection('calculator');
            console.log('Current interaction data:', interactionData);
        };
    }

    if (typeof updateValues !== 'undefined') {
        const originalUpdateValues = updateValues;
        updateValues = function() {
            console.log('Ratio slider adjusted with values:', slider1.value, slider2.value);
            originalUpdateValues.apply(this, arguments);
            interactionData.ratioSliderChanges.push({ slider1: slider1.value, slider2: slider2.value });
            switchSection('ratioSlider');
            console.log('Current interaction data:', interactionData);
        };
    }

    if (typeof selectRectangle !== 'undefined') {
        const originalSelectRectangle = selectRectangle;
        selectRectangle = function(selected) {
            originalSelectRectangle.apply(this, arguments);
            interactionData.rectangleSelection = selected;
            switchSection('rectangleSelection');
            sendDataToServer(interactionData); // Assuming you want to send data upon selection
        };
    }

    // Send data when the user leaves the page or after the selection
    window.addEventListener('beforeunload', () => {
        if (activeSection !== 'none') {
            interactionData.timeSpent[activeSection] += Date.now() - activeSectionStartTime;
        }
        sendDataToServer(interactionData);
    });

    // Initialize switchSection to start tracking time
    switchSection('none');
});
