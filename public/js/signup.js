const form = document.getElementById("form");
const firstName = document.getElementById("firstNameInput");
const lastName = document.getElementById("lastNameInput");
const email = document.getElementById("emailInput");
const password = document.getElementById("passwordInput");
const repeatPassword = document.getElementById("repeatPasswordInput");
const errorMessage = document.getElementById("errorMessage");

// Event listener for form
form.addEventListener("submit", async function (e) {
	e.preventDefault(); //prevent form submition

	// reset error styles and txt
	clearErrors();
	let errorMessages = [];

    //first name validation
    if (firstName.value.trim() === ""){
        errorMessages.push('First name is required');
        showError(firstName);
    } else if (firstName.value.length < 2) {
        errorMessages.push('First name must be at least 2 characters long');
        showError(firstName);
    } else if (firstName.value.length > 40) {
        errorMessages.push('First name must be less than 40 characters long');
        showError(firstName);
    }
    //last name validation
    if (lastName.value.trim() === ""){
        errorMessages.push('last name is required');
        showError(lastName);
    }  else if (lastName.value.length < 2) {
        errorMessages.push('Last name must be at least 2 characters long');
        showError(lastName);
    } else if (lastName.value.length > 40) {
        errorMessages.push('Last name must be less than 40 characters long');
        showError(lastName);
    }
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
    // password has to match validation
    if (password.value !== repeatPassword.value) {
        errorMessages.push('Password do not match');
        showError(repeatPassword);
    }
    // Display error messages
    if (errorMessages.length > 0) {
        errorMessage.innerHTML = errorMessages.join("<br>");
    } else {
        //if no errors, reset form and show success notifications
		errorMessage.textContent = ""; // CLear any error text
		try {
			const response = await fetch("/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					firstname: firstName.value,
					lastname: lastName.value,
					email: email.value,
					password: password.value,
				})
			});
			const data = await response.json();
			if (response.ok) {  
				if (data.error) {
					errorMessage.textContent = data.error;
				} else {
                    window.location.href = '/login'
                }
			}
		} catch (err) {
			errorMessage.innerHTML = err;
		}
    }
});

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function showError(input) {
	const parentDiv = input.parentElement;
	parentDiv.classList.add("incorrectTxt");
}

function clearErrors() {
	errorMessage.textContent = "";
	const inputs = document.querySelectorAll("form div");
	inputs.forEach((div) => div.classList.remove("incorrectTxt"));
}
