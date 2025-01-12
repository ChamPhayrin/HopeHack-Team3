window.onload = () => {
	if (localStorage.getItem("user_id")) {
		alert(
			"You are already logged in! Please logout to sign in to another account."
		);
		window.location.href = "/";
	}
};

const form = document.getElementById("form");
const email = document.getElementById("emailInput");
const password = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");

// Event listener for form
form.addEventListener("submit", async function (e) {
	e.preventDefault(); //prevent form submition

	// reset error styles and txt
	clearErrors();
	let errorMessages = [];
	//email validation
	if (!isValidEmail(email.value)) {
		errorMessages.push("Please enter a valid email address");
		showError(email);
	}
	// Display error messages
	if (errorMessages.length > 0) {
		errorMessage.innerHTML = errorMessages.join("<br>");
	} else {
		//if no errors, reset form and show success notifications
		errorMessage.textContent = ""; // CLear any error text
		let formData = new FormData(form);
		formData = Object.fromEntries(formData);
		try {
			const response = await fetch("/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				if (data.error) {
					errorMessage.innerHTML = data.error;
				} else {
					const userData = data.userData;
					localStorage.setItem("user_id", userData.user_id);
					localStorage.setItem("first_name", userData.first_name);
					localStorage.setItem("last_name", userData.last_name);
					localStorage.setItem("email", userData.email);
					window.location.href = "/";
				}
			}
		} catch (error) {
			console.log("Failed login: ", error);
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