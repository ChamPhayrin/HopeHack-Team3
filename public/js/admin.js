async function loadMessages() {
  try {
    const response = await fetch('/getMessages');
    const data = await response.json();

    const messagesContainer = document.querySelector('.messages-container');
    const messageHeader = document.querySelector('.messages-header')
    const greetHeader = document.getElementById('container-greet')

    if (localStorage.getItem('is_admin') === '0' || !localStorage.getItem('is_admin')) {
      greetHeader.innerHTML = `<h1>Unathorized Acess</h1>`;
      messagesContainer.innerHTML = '';
      messageHeader.innerHTML = '';
      return;
    } else {
      if (!messagesContainer) {
        console.error('Messages container not found');
        return;
      }

      if (data && Array.isArray(data.messages)) {

        messagesContainer.innerHTML = '';


        for (const message of data.messages) {
          console.log(message); 

          const div = document.createElement('div');
          div.classList.add('message-item');
          

          const fullName = message.full_name || 'Anonymous';
          const email = message.email || '#'; 

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
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadMessages);
