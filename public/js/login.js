const form = document.getElementById("form")
const email = document.getElementById('emailInput')
const password = document.getElementById('passwordInput')
const errorMessage = document.getElementById("errorMessage")

// Event listener for form
form.addEventListener('submit', function (e) {
    e.preventDefault(); //prevent form submition

    // reset error styles and txt
    clearErrors();
    let errorMessages = [];
    //email validation
    if (!isValidEmail(email.value)) {
        errorMessages.push('Please enter a valid email address');
        showError(email);
    }
    //password validation
    if (password.value.length < 8) {
        errorMessages.push('Password must be at least 8 characters long');
        showError(password)
    }
    // Display error messages
    if (errorMessages.length > 0) {
        errorMessage.innerHTML = errorMessages.join("<br>");
    } else {
        //if no errors, reset form and show success notifications
        alert('Thank you!');
        form.reset();
        errorMessage.textContent = ""; // CLear any error text
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input) {
    const parentDiv = input.parentElement;
    parentDiv.classList.add('incorrectTxt');
}


function clearErrors() {
    errorMessage.textContent = "";
    const inputs = document.querySelectorAll("form div");
    inputs.forEach(div => div.classList.remove('incorrectTxt'));
}