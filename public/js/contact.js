document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("conContainer");
  const nameInput = document.getElementById("conName");
  const emailInput = document.getElementById("conEmail");
  const messageInput = document.getElementById("conMsg");
  const errorMessage = document.getElementById("conError");

  // Simple validation function
  function validateForm() {
    let isValid = true;
    let errorMessages = []; // Collect error messages

    errorMessage.textContent = "";
    form.querySelectorAll(".incorrect").forEach((div) => div.classList.remove("incorrect"));

    //Name validation
    if (!nameInput.value.trim()) {
      isValid = false;
      errorMessages.push("Full name is required");
      showError(nameInput);
    } else if (nameInput.value.trim().length < 2) {
      isValid = false;
      errorMessages.push("Full name must be at least 2 characters long");
      showError(nameInput);
    } else if (nameInput.value.trim().length > 40) {
      isValid = false;
      errorMessages.push("Full name must be less than 40 characters long");
      showError(nameInput);
    }

    //Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      isValid = false;
      errorMessages.push("Please  enter a valid email address");
      showError(emailInput);
    }

    if (!messageInput.value.trim()) {
      isValid = false;
      errorMessages.push("Message is required");
      showError(messageInput);
    } else if (messageInput.value.trim().length < 10) {
      isValid = false;
      errorMessages.push("Message must be at least 10 characters long");
      showError(messageInput);
    }
    if (errorMessages.length > 0) {
      errorMessage.innerHTML = errorMessages.join("<br>")
    }
    return isValid;
  }

  function showError(input) {
    const parentDiv = input.parentElement;
    parentDiv.classList.add("incorrect")
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    if (validateForm()) {
      alert('Thank you')
      form.reset();
      errorMessage.textContent = "";
      form.querySelectorAll(".incorrect").forEach((div) => div.classList.remove("incorrect"))
    }
  });
});
