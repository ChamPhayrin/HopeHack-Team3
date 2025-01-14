const form = document.getElementById('ai-form');
const input = document.getElementById('imageUpload');
const imageContainer = document.getElementById('image-container');
const uploadedImage = document.getElementById('uploadedImage'); 
const aiProbabilityDisplay = document.getElementById('aiProbability')
const aiResult = document.getElementById('aiResult-text')


form.addEventListener('submit', (e) => {
  e.preventDefault();

          aiResult.innerHTML = `<dotlottie-player src="https://lottie.host/14eb8b59-caf3-48c7-a7d1-9f0ea56bf195/hBCe7mD3Hz.lottie" background="transparent" speed="1" style="width: 100px; height: 100px" loop autoplay></dotlottie-player>`
  const formData = new FormData();
  formData.append('image', input.files[0]);

  
  fetch('/aiOrNot', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
  
    if (data.error) {
      aiProbabilityDisplay.innerHTML = `Error: ${data.error}`
      return;
    }

    const { aiProbability, imageBase64, imageMimeType } = data;

        if (aiProbability >= '60%') {
          aiProbabilityDisplay.innerHTML = " Likely AI: " + aiProbability;
          aiProbabilityDisplay.style.color = 'red';
          aiResult.innerHTML = `Oh no! Your image is likely AI generated. Want to check out artworks made by real artists? <a href="./explore" target="_blank">Discover Art</a>`
        } else {
          aiProbabilityDisplay.innerHTML = " Not Likely AI: " + aiProbability;
          aiProbabilityDisplay.style.color = 'green'; 
          aiResult.innerHTML = `Yay! Your image is likely not AI generated. Want to check out artworks made by real artists? <a href="./explore" target="_blank">Discover Art</a>`
        }


    uploadedImage.src = `data:${imageMimeType};base64,${imageBase64}`;

  })
  .catch(error => {
    aiProbabilityDisplay.innerHTML = `Error: ${error}`
  });
});
