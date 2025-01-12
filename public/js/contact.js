document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("conContainer");
  const nameInput = document.getElementById("conName");
  const emailInput = document.getElementById("conEmail");
  const messageInput = document.getElementById("conMsg");
  const errorMessage = document.getElementById("conError");
  const nameDisplay = document.getElementById('conName-container');
  const emailDisplay = document.getElementById('conEmail-container')
  const userGreet = document.getElementById('userGreet')

  if(localStorage.getItem('user_id')){
    nameDisplay.style.display = 'none'
    emailDisplay.style.display = 'none'
    userGreet.innerHTML = `Hi, ${localStorage.getItem('first_name')} leave us a message!`
  }

  // Simple validation function
  function validateForm() {
    let isValid = true;
    errorMessage.textContent = ""; // Clear previous error messages
    form
      .querySelectorAll("input, textarea")
      .forEach((input) => (input.style.borderColor = ""));

    if(localStorage.getItem('user_id')) {
      if (!messageInput.value.trim()) {
        isValid = false;
        messageInput.style.borderColor = "#ff0000";
        errorMessage.textContent = "Please enter your message.";
      }
    } else {
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
    }

    return isValid;
  }

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    if (validateForm()) {
      if(localStorage.getItem('user_id')){
        try {
          fetch('/contactMessage',  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: localStorage.getItem('user_id'),
              full_name: null,
              email: null,
              message: messageInput.value
            })
          })

          const modalDisplay = document.getElementById('con-container-modal');
          modalDisplay.style.display = 'flex'

          setTimeout(() => {
            window.location.href = '/'
          }, 3000);

        } catch (err) {
          console.log(err)
        }

      } else {
        try {
          fetch('/contactMessage',  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: null,
              full_name: nameInput.value,
              email: emailInput.value,
              message: messageInput.value
            })
          })

          const modalDisplay = document.getElementById('con-container-modal');
          modalDisplay.style.display = 'flex'

          setTimeout(() => {
            window.location.href = '/'
          }, 3000);
        } catch (err) {
          console.log(err)
        }
      }
    }
  });
});

