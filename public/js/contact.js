document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("conContainer");
  const nameInput = document.getElementById("conName");
  const emailInput = document.getElementById("conEmail");
  const messageInput = document.getElementById("conMsg");
  const errorMessage = document.getElementById("conError");

  // Simple validation function
  function validateForm() {
    let isValid = true;
    errorMessage.textContent = ""; // Clear previous error messages
    form
      .querySelectorAll("input, textarea")
      .forEach((input) => (input.style.borderColor = ""));

    if (!nameInput.value.trim()) {
      isValid = false;
      nameInput.style.borderColor = "#ff0000";
      errorMessage.textContent = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      isValid = false;
      emailInput.style.borderColor = "#ff0000";
      errorMessage.textContent = "Please enter a valid email address.";
    }

    if (!messageInput.value.trim()) {
      isValid = false;
      messageInput.style.borderColor = "#ff0000";
      errorMessage.textContent = "Please enter your message.";
    }

    return isValid;
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    if (validateForm()) {
      form.submit(); // Submit the form if valid
    }
  });
});
