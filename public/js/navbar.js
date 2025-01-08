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
});
