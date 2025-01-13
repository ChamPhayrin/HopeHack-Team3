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
  const profileIcon = document.getElementById("profile-icon");
  const profileIconSide = document.getElementById('profile-icon-side');
  const joinBtn = document.getElementById("join-btn");
  const loginBtn = document.getElementById("login-btn");

  // Open the modal when the profile icon is clicked
  profileIcon.addEventListener("click", function () {
    modal.style.display = "flex"; // Show the modal
  });
  
  profileIconSide.addEventListener("click", () =>{
    modal.style.display = "flex"; // Show the modal
  })

  // Close the modal when you click on the background (outside the modal content)
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none"; // Hide the modal
      console.log('click')
    }
  });

  //   // Optional: Handle Join and Login button clicks
  //   joinBtn.addEventListener("click", function () {
  //     alert("Join button clicked.");
  //     modal.style.display = "none"; // Hide the modal after clicking
  //   });

  //   loginBtn.addEventListener("click", function () {
  //     alert("Login button clicked.");
  //     modal.style.display = "none"; // Hide the modal after clicking
  //   });
});
