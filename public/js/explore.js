console.log('Client side JS online!');

// Function to handle fetching and displaying artworks
function fetchArtworks(searchValue, cardContainer, searchTitle, error) {
  // Clear previous results and show loading 
  error.classList.remove('hidden'); 
  cardContainer.classList.add('hidden');
  cardContainer.innerHTML = '';
  searchTitle.innerHTML = 'Loading results...';

  // Add Dottie animation to indicate loading 
  error.innerHTML = `
    <dotlottie-player src="https://lottie.host/4155d26b-007e-4c02-b0de-e4c2ef991cd1/JcI0L1FgVY.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>
  `;

  // Fetch data based on the search value
  fetch(`/q/?q=${searchValue}`).then(res => {
    return res.json();
  }).then(data => {
    if (data.error) {
      showError(error, cardContainer, searchTitle, `ERROR: ${data.error}`);
      return;
    }

    // Handle empty results
    if (data.artworks.length === 0) {
      showError(error, cardContainer, searchTitle, 'Sorry, no artwork available');
      return;
    }

    // Display results
    displayResults(data.artworks, cardContainer, searchTitle, error, searchValue);
  }).catch(error => {
    // Handle fetch error
    console.error('Error fetching data:', error);
    showError(error, cardContainer, searchTitle, 'An error occurred. Please try again later.');
  });
}

// Function to handle displaying artwork results
function displayResults(artworks, cardContainer, searchTitle, error, searchValue) {
  error.classList.add('hidden');  // Hide error message (or loading animation) after fetching
  searchTitle.innerHTML = searchValue.toUpperCase();
  cardContainer.classList.remove('hidden');
  cardContainer.innerHTML = '';

  artworks.forEach(art => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${art.img_link}" alt="${art.title}">
      <div class="card-content">
        <h2>${art.title}</h2>
        <h6>${art.artist_display}</h6>
        <p>${art.description}</p>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

// Function to handle error display
function showError(error, cardContainer, searchTitle, message) {
  error.classList.remove('hidden');
  cardContainer.classList.add('hidden');
  searchTitle.innerHTML = '';
  error.innerHTML = message;
}

// Handle form submit
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const cardContainer = document.getElementById('container-card');
  const searchTitle = document.getElementById('search-title');
  const error = document.getElementById('container-error');
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.trim(); // Remove extra spaces from input

  // Handle empty search
  if (searchValue.length === 0) {
    showError(error, cardContainer, searchTitle, 'Please enter a search term');
    return;
  }

  if(localStorage.getItem('user_id')){
    
    fetch('/saveSearch', {
      method: 'POST',
      body: {
        user_id: ``,
        search
      }
    })

  }

  // Check for invalid search term
  if (searchValue.length < 3) {
    showError(error, cardContainer, searchTitle, 'Search term must be at least 3 characters long');
    return;
  }

  // Fetch artworks based on user input
  fetchArtworks(searchValue, cardContainer, searchTitle, error);
});

// Load default artworks ('Salvador Dalí')
window.addEventListener('load', () => {
  const cardContainer = document.getElementById('container-card');
  const searchTitle = document.getElementById('search-title');
  const error = document.getElementById('container-error');
  const defaultSearchValue = 'MUSE';

  fetchArtworks(defaultSearchValue, cardContainer, searchTitle, error);
});
