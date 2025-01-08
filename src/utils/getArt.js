// NPM MODULES
const axios = require('axios');
const dotenv = require('dotenv');  
// Load variables from the .env file
dotenv.config();

async function getArtwork(search) {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${search}&size=20`, {
      headers: {
        "AIC-User-Agent": `aic-bash (${process.env.ART_API_EMAIL})`
      }
    });

    const artwork = [];
    
    // Loop through the search results
    for (const art of response.data.data) {
      try {
        // Fetch details of each artwork
        const detailResponse = await axios.get(art.api_link);
        
        const description = detailResponse.data.data.description;

        // Only add artwork if it has a description
        if (description && description.trim() !== '') {
          artwork.push({
            id: detailResponse.data.data.id,
            title: detailResponse.data.data.title,
            artist_display: detailResponse.data.data.artist_display,
            date_display: detailResponse.data.data.date_display,
            description: description, // Only include paintings with descriptions
            img_link: `https://www.artic.edu/iiif/2/${detailResponse.data.data.image_id}/full/843,/0/default.jpg`
          });
        }
      } catch (error) {
        console.log(`Error fetching details for painting ${art.id}:`, error);
      }
    }

    return artwork; // Return the filtered artworks array
  } catch (error) {
    console.log('Error during artwork search:', error);
    return []; // Return an empty array if there was an error
  }
}

// TEST
// getArtwork('china').then(data => console.log(data))s
// console.log(process.env.ART_API_EMAIL)

module.exports = getArtwork;
