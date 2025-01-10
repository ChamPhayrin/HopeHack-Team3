const registerForm = document.getElementById('formContainer')

const API_URL = '/'

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const firstName = document.getElementById('firstNameInput').value;
  const lastName = document.getElementById('lastNameInput').value;

  try{
    const response = await fetch (`${API_URL}register`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password, firstName, lastName}),
    })

    const data = await response.json()

    if(response.ok){
      alert('Successfully applied')
    } else {
      alert(data.error)
    }
  } catch (error){
    alert(error)
  }
  
})