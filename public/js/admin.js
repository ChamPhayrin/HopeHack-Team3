async function loadMessages() {
  try {
    const response = await fetch('/getMessages');
    const data = await response.json();

    const messagesContainer = document.querySelector('.messages-container');
    const messageHeader = document.querySelector('.messages-header');
    const greetHeader = document.getElementById('container-greet');

    // Check if the user is an admin
    const isAdmin = localStorage.getItem('is_admin');
    if (isAdmin === '0' || !isAdmin || isAdmin === 'undefined') {
      greetHeader.innerHTML = `<h1>Unauthorized Access</h1>`;
      messagesContainer.innerHTML = '';
      messageHeader.innerHTML = '';
      return;
    } else {
      // Check if messagesContainer exists
      if (!messagesContainer) {
        console.error('Messages container not found');
        return;
      }

      // Check if data contains messages
      if (data && Array.isArray(data.messages)) {
        messagesContainer.innerHTML = ''; // Clear the container before appending new messages

        // Loop through each message and create the HTML elements
        for (const message of data.messages) {
          console.log(message);

          const div = document.createElement('div');
          div.classList.add('message-item');

          // Default 'Anonymous' if full_name is not provided
          const fullName = message.full_name || 'Anonymous';
          const email = message.email || '#';

          // Build the HTML structure for each message
          div.innerHTML = `
            <input type="checkbox" id="message-${message.contact_id}" class="message-checkbox">
            <label for="message-${message.contact_id}" class="message-user">
              <span class="message-icon"><i class="fas fa-envelope"></i></span> Message from ${fullName}
            </label>
            <div class="message-user-message">
              <p>${message.message}</p>
            </div>
            <span class="message-timestamp">Sent on: ${new Date(message.created_at).toLocaleString()}</span>
            <a href="mailto:${email}" class="message-email">${fullName === 'Anonymous' ? 'Email Unknown' : `Email ${fullName}`}</a>
          `;

          // Append the message to the container
          messagesContainer.appendChild(div);
        }
      } else {
        // If no messages are found, display a message
        messagesContainer.innerHTML = '<p>No messages available.</p>';
      }
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Load messages when the DOM is ready
document.addEventListener('DOMContentLoaded', loadMessages);
