const axios = require('axios');
const dotenv = require('dotenv');  
dotenv.config();

async function getArtwork(search) {
  try {
    // Fetch artworks based on search term
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?q=${search}&size=20`, {
      headers: {
        "AIC-User-Agent": `aic-bash (${process.env.ART_API_EMAIL})`
      }
    });

    // Prepare an array of promises to fetch artwork details in parallel
    const artworkPromises = response.data.data.map(art =>
      axios.get(art.api_link).then(detailResponse => {
        const { data } = detailResponse.data;
        let description = data.description;

        // Only process descriptions that are not empty
        if (description && description.trim() !== '') {
          description = removeExtraPTags(description);
          
          return {
            id: data.id,
            title: data.title,
            artist_display: data.artist_display,
            date_display: data.date_display,
            description: description, // Cleaned description
            img_link: `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`
          };
        }
      }).catch(error => {
        // Handle individual artwork fetch errors
        console.log(`Error fetching details for painting:`, error);
        return null; // return null for failed artwork fetch
      })
    );

    // Wait for all artwork details to be fetched and filter out nulls
    const artworks = (await Promise.all(artworkPromises)).filter(Boolean);

    return artworks; // Return the filtered artworks array
  } catch (error) {
    console.log('Error during artwork search:', error);
    return []; // Return an empty array if there was an error
  }
}

/**
 * Removes all <p> tags after the first one.
 */
function removeExtraPTags(description) {
  let pTagCount = 0;
  
  // Match and remove <p> tags and their content
  return description.replace(/<p>.*?<\/p>/g, (match) => {
    pTagCount++;
    // Only keep the first <p> tag, remove subsequent ones
    return pTagCount > 1 ? '' : match;
  });
}

// TEST
// getArtwork('rome').then(data => console.log(data));

module.exports = getArtwork;
