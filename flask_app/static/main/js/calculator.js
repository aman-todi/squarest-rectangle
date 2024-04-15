// JavaScript to implement a calculator
//
// Author: Aman Todi

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentInput = '';
    let currentOperation = null;
    let result = null;

    function appendDigit(digit) {
        if (!(currentInput === "" && digit === "0")) {
            currentInput += digit;
            updateDisplay(currentInput);
        }
    }

    function setOperation(operation) {
        if (result !== null && currentInput === '') {
            currentOperation = operation;
        } else if (currentInput !== '') {
            if (currentOperation !== null) {
                calculate();
            } else {
                result = parseFloat(currentInput);
            }
            operationString = result + ' ' + operation + ' '; // Start forming the operation string
            currentInput = '';
            currentOperation = operation;
        }
    }

    function clearAll() {
        currentInput = '';
        currentOperation = null;
        result = null;
        operationString = ''; // Reset the operation string
        updateDisplay('0');
    }

    function calculate() {
        if (currentInput !== '' && currentOperation !== null) {
            const currentInputNumber = parseFloat(currentInput);
            operationString += currentInput; // Append second operand to operation string


            switch (currentOperation) {
                case '+':
                    result += currentInputNumber;
                    break;
                case '-':
                    result -= currentInputNumber;
                    break;
                case '*':
                    result *= currentInputNumber;
                    break;
                case '/':
                    if (currentInputNumber !== 0) {
                        result /= currentInputNumber;
                    } else {
                        alert('Cannot divide by zero.');
                        clearAll();
                        return;
                    }
                    break;
            }
            if (!Number.isInteger(result)){
                result = parseFloat(result.toFixed(2)); 
            }

            // Append the result to the operation string
            operationString += ' = ' + result;
            // Record the operation
            window.interactionData.calculatorOperations.push(getCurrentDateTime() + ' : ' + operationString);
            operationString = '';

            currentInput = ''; // Clear the input
            currentOperation = null; // Clear the operation
            updateDisplay(result.toString());
        }
        else if (result !== null) {
            updateDisplay(result.toString());
        }
    }

    function updateDisplay(value) {
        const display = document.getElementById('display');
        display.value = value;
    }

    // Bind event listeners to buttons
    document.querySelectorAll('.digit').forEach(button => {
        button.addEventListener('click', function() {
            appendDigit(this.textContent);
        });
    });

    document.querySelectorAll('.operation').forEach(button => {
        button.addEventListener('click', function() {
            setOperation(this.textContent);
        });
    });

    document.getElementById('clear').addEventListener('click', clearAll);
    document.getElementById('equals').addEventListener('click', function() {
        calculate();
    });

    // Initialize display
    updateDisplay('0');
});