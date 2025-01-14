document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const sideNav = document.querySelector(".side-nav");
  const navWrapper = document.querySelector(".nav-wrapper");
  const modal = document.getElementById("profile-modal");
  const profileModal = document.getElementById("profile-modal-loggedin");
  const profileIcon = document.getElementById("profile-icon");
  const profileIconSide = document.getElementById("profile-icon-side");
  const joinBtn = document.getElementById("join-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const adminBtn = document.getElementById("admin-btn");

  // Helper function to capitalize strings
  const capitalizeString = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Reusable function to handle profile modal display logic
  function handleProfileModal(profileIconElement) {
    profileIconElement.addEventListener("click", function () {
      if (localStorage.getItem("user_id")) {
        const emailDisplay = document.getElementById("loggedin-info-email");
        const nameDisplay = document.getElementById("loggedin-info-name");
        const userDisplay = document.getElementById("loggedin-info-user");

        // Fetch user's search history and populate the list
        fetch(`/getSearch?user_id=${localStorage.getItem("user_id")}`).then(res => res.json()).then(res => {
          const ul = document.getElementById('loggedin-info-searches-list');
          ul.innerHTML = '';  // Clear existing list

          res.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.search_query;
            ul.appendChild(li);
          });
        });

        // Update profile modal with user information
        profileModal.style.display = "flex";
        userDisplay.innerHTML = `Hi, ${capitalizeString(localStorage.getItem("first_name"))}!`;
        emailDisplay.innerHTML = `Email: ${localStorage.getItem("email")}`;
        nameDisplay.innerHTML = `Name: ${capitalizeString(localStorage.getItem("first_name"))} ${capitalizeString(localStorage.getItem("last_name"))}`;

        // Logout functionality
        logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "/";
        });

        // Show admin button if the user is an admin
        if (localStorage.getItem('is_admin') === '1') {
          adminBtn.style.display = "block";
          adminBtn.addEventListener('click', () => {
            window.location.href = "/admin";  // Redirect to admin page
          });
        } else {
          adminBtn.style.display = "none";
        }
      } else {
        // Show the modal for Join/Login if user is not logged in
        modal.style.display = "flex";

        joinBtn.addEventListener("click", function () {
          modal.style.display = "none";  // Hide modal after clicking
        });

        loginBtn.addEventListener("click", function () {
          modal.style.display = "none";  // Hide modal after clicking
        });
      }
    });
  }

  // Initialize profile modal functionality for both icons
  handleProfileModal(profileIcon);
  handleProfileModal(profileIconSide);

  // Toggle side navigation when hamburger menu is clicked
  if (hamburgerMenu && sideNav) {
    hamburgerMenu.addEventListener("click", () => {
      sideNav.classList.toggle("active");
    });
  } else {
    console.error("Error: Hamburger or Sidebar element not found.");
  }

  // Close side navigation if the user clicks outside of it
  document.addEventListener("click", (e) => {
    if (
      sideNav.classList.contains("active") &&
      !sideNav.contains(e.target) &&
      !hamburgerMenu.contains(e.target) &&
      !navWrapper.contains(e.target)
    ) {
      sideNav.classList.remove("active");
    }
  });


  // Close the modal when you click on the background (outside the modal content)
  window.addEventListener("click", (event) => {
    if ([modal, profileModal].includes(event.target)) {
      event.target.style.display = "none";  // Hide modal

  // Get modal and buttons
  const modal = document.getElementById("profile-modal");
  const profileIcon = document.getElementById("profile-icon");
  const profileIconSide = document.getElementById("profile-icon-side");

  // Open the modal when the profile icon is clicked
  profileIcon.addEventListener("click", function () {
    modal.style.display = "flex"; // Show the modal
  });

  profileIconSide.addEventListener("click", () => {
    modal.style.display = "flex"; // Show the modal
  });


    }
  });
});
