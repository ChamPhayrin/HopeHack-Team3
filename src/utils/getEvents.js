// NPM MODULES
const axios = require('axios');
require('dotenv').config({path:__dirname+'/./../../.env'}) //Redirecting execution path towards .env file

let eventsApiKey = process.env.EVENTS_API_KEY

async function getHistoricalEvents(search) {
  try {
    const response = await axios.get(
      `https://historical-events-by-api-ninjas.p.rapidapi.com/v1/historicalevents?text=${search}`,
      {
        headers: {
        'x-rapidapi-key': `${process.env.EVENTS_API_KEY}`,
        'x-rapidapi-host': 'historical-events-by-api-ninjas.p.rapidapi.com'
        },
      }
    );

    const historicalEvents = [];

    for(const event of response.data){
      historicalEvents.push({
        date: `${event.month}/${event.day}/${event.year}`,
        event: event.event,
      })
      ;}
    

    return historicalEvents; // Return the formatted events array
  } catch (error) {
    console.error("Error during historical events search:", error);
    throw error; // Ensure the error is thrown so it can be handled elsewhere
  }
}

//TEST
// getHistoricalEvents('roman empire').then(data => console.log(data))
// console.log(process.env)


module.exports = getHistoricalEvents;
