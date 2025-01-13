// this example uses axios and form-data
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


async function aiOrNotinator(userImgPath) {
  data = new FormData();
  data.append('media', fs.createReadStream(`${userImgPath}`));
  data.append('models', 'genai');
  data.append('api_user', '229240628');
  data.append('api_secret', 'hsvfQ36C4gCTMK2BtWoWqzHsRQmzeNHf');

  return axios({
    method: 'post',
    url:'https://api.sightengine.com/1.0/check.json',
    data: data,
    headers: data.getHeaders()
  })
  .then(function (response) {
    // on success: handle response
    return  (response.data.type.ai_generated * 100) + `%`
  })
  .catch(function (error) {
    // handle error
    if (error.response) return {error: error.response.data};
    else return {error: error.message};
  });
}

// aiOrNotinator('../exploreBanner.avif').then( data => console.log(data))

module.exports = aiOrNotinator;