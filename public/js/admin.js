async function loadMessages() {
  try {
    const response = await fetch('/getMessages');
    const data = await response.json();
    console.log(data); // Check the structure of the data

    // Change to target the correct container
    const messagesContainer = document.getElementsByClassName('messages-container');
    const greetAdmin = document.getElementById('container-greet-text')
    if (!messagesContainer) {
      console.error('Messages container not found');
      return;
    }

    if (data.messages && Array.isArray(data.messages)) {

      for (const message of data.messages) {
        console.log(message); // Check each message

        const div = document.createElement('div');
        div.classList.add('message-item');
        
        // Default values for missing user information
        const fullName = message.full_name || 'Anonymous';
        const email = message.email || '#'; // Placeholder for email link

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
        messagesContainer.appendChild(div);
      }
    } else {
      messagesContainer.innerHTML = '<p>No messages available.</p>';
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Ensure the page is loaded before running this
document.addEventListener('DOMContentLoaded', loadMessages);
