document.addEventListener("DOMContentLoaded", () => {
	const hamburgerMenu = document.querySelector(".hamburger-menu");
	const sideNav = document.querySelector(".side-nav");
	const navWrapper = document.querySelector(".nav-wrapper");

	// Toggle the side navigation when the hamburger menu is clicked
	if (hamburgerMenu && sideNav) {
		hamburgerMenu.addEventListener("click", () => {
			sideNav.classList.toggle("active");
		});
	} else {
		console.error("Error: Hamburger or Sidebar element not found.");
	}

	// Close the side navigation if the user clicks outside of it
	document.addEventListener("click", (e) => {
		// Check if the side nav is open and the click target is outside of it
		if (
			sideNav.classList.contains("active") &&
			!sideNav.contains(e.target) &&
			!hamburgerMenu.contains(e.target) &&
			!navWrapper.contains(e.target)
		) {
			sideNav.classList.remove("active");
		}
	});

	// Get modal and buttons
	const modal = document.getElementById("profile-modal");
	const profileModal = document.getElementById("profile-modal-loggedin");
	const profileIcon = document.getElementById("profile-icon");
	const joinBtn = document.getElementById("join-btn");
	const loginBtn = document.getElementById("login-btn");
	const logoutBtn = document.getElementById("logout-btn");

	// Open the modal when the profile icon is clicked
	profileIcon.addEventListener("click", function () {
		if (localStorage.getItem("user_id")) {
			const emailDisplay = document.getElementById("loggedin-info-email");
			const firstNameDisplay = document.getElementById(
				"loggedin-info-firstName"
			);
			const lastNameDisplay = document.getElementById("loggedin-info-lastName");
			const userDisplay = document.getElementById("loggedin-info-user");
			const capitalizeString = (str) =>
				str.replace(/\b\w/g, (char) => char.toUpperCase());

			profileModal.style.display = "flex";

			userDisplay.innerHTML = ` Hi, ${capitalizeString(
				localStorage.getItem("first_name")
			)}!`;
			emailDisplay.innerHTML = localStorage.getItem("email");
			firstNameDisplay.innerHTML = capitalizeString(
				localStorage.getItem("first_name")
			);
			lastNameDisplay.innerHTML = capitalizeString(
				localStorage.getItem("last_name")
			);

			// Logout button
			logoutBtn.addEventListener("click", () => {
				localStorage.clear();
				window.location.href = "/";
			});
		} else {
			modal.style.display = "flex"; // Show the modal

			// Optional: Handle Join and Login button clicks
			joinBtn.addEventListener("click", function () {
				alert("Join button clicked.");
				modal.style.display = "none"; // Hide the modal after clicking
			});

			loginBtn.addEventListener("click", function () {
				alert("Login button clicked.");
				modal.style.display = "none"; // Hide the modal after clicking
			});
		}
	});

  	// Close the modal when you click on the background (outside the modal content)
    window.addEventListener("click", (event) => {
      if ([modal, profileModal].includes(event.target)) {
        event.target.style.display = "none"; // Hide the modal
      }
    });

});
