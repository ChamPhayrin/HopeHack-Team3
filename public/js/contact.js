document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("conContainer");
  const nameInput = document.getElementById("conName");
  const emailInput = document.getElementById("conEmail");
  const messageInput = document.getElementById("conMsg");
  const errorMessage = document.getElementById("conError");
  const nameDisplay = document.getElementById('conName-container');
  const emailDisplay = document.getElementById('conEmail-container');
  const userGreet = document.getElementById('userGreet');

  if (localStorage.getItem('user_id')) {
    nameDisplay.style.display = 'none';
    emailDisplay.style.display = 'none';
    userGreet.innerHTML = `Hi, ${localStorage.getItem('first_name')} leave us a message!`;
  }

  // Simple validation function
  function validateForm() {
    let isValid = true;
    let errorMessages = []; // Collect error messages
    errorMessage.textContent = "";  // Clear previous errors
    form.querySelectorAll(".incorrect").forEach((div) => div.classList.remove("incorrect"));

    // Validate name
    if (!localStorage.getItem('user_id')) {
      if (!nameInput.value.trim()) {
        isValid = false;
        errorMessages.push("Full name is required.");
        showError(nameInput);
      } else if (nameInput.value.trim().length < 2) {
        isValid = false;
        errorMessages.push("Full name must be at least 2 characters.");
        showError(nameInput);
      } else if (nameInput.value.trim().length > 40) {
        isValid = false;
        errorMessages.push("Full name must be less than 40 characters.");
        showError(nameInput);
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!localStorage.getItem('user_id') && (!emailInput.value.trim() || !emailRegex.test(emailInput.value))) {
      isValid = false;
      errorMessages.push("Please enter a valid email address.");
      showError(emailInput);
    }

    // Validate message
    if (!messageInput.value.trim()) {
      isValid = false;
      errorMessages.push("Message is required.");
      showError(messageInput);
    } else if (messageInput.value.trim().length < 10) {
      isValid = false;
      errorMessages.push("Message must be at least 10 characters long.");
      showError(messageInput);
    }

    // Show error messages if any
    if (errorMessages.length > 0) {
      errorMessage.innerHTML = errorMessages.join("<br>");
    }

    return isValid;
  }

  function showError(input) {
    const parentDiv = input.parentElement;
    parentDiv.classList.add("incorrect");
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    if (validateForm()) {
      const data = {
        user_id: localStorage.getItem('user_id') || null,
        full_name: localStorage.getItem('user_id') ? null : nameInput.value,
        email: localStorage.getItem('user_id') ? null : emailInput.value,
        message: messageInput.value
      };

      try {
        fetch('/contactMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Show success modal and reset form
        const modalDisplay = document.getElementById('con-container-modal');
        modalDisplay.style.display = 'flex';

        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
        
        // Clear form and reset error states
        form.reset();
        form.querySelectorAll(".incorrect").forEach((div) => div.classList.remove("incorrect"));
        errorMessage.textContent = "";
        
      } catch (err) {
        console.log(err);
      }
    }
  });
});
