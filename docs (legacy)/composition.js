// Get reference to the wrapper div
var wrapperDiv = document.getElementById('q1'); // all the way to q10

// Get all radio buttons inside the wrapper div
var radioButtons = wrapperDiv.querySelectorAll('input[type="radio"][name="yes_no"]');

// Variable to store the selected value
var selectedValue;

// Loop through radio buttons to find the checked one
radioButtons.forEach(function(radioButton) {
  if (radioButton.checked) {
    selectedValue = radioButton.value;
  }
});

// Now selectedValue contains the value of the selected radio button
console.log(selectedValue);
