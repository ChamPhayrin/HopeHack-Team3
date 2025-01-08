// NPM MODULES
const axios = require('axios');
require('dotenv').config({path:__dirname+'/./../../.env'}) //Redirecting execution path towards .env file

let eventsApiKey = process.env.EVENTS_API_KEY

async function getHistoricalEvents(search, limit) {
  try {
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/historicalevents?text=${search}`,
      {
        headers: {
          "X-Api-Key": `${eventsApiKey}`, 
        },
      }
    );

    const historicalEvents = [];

    // Loop through the historical events and limit the number based on artwork count
    for (let i = 0; i < Math.min(response.data.length, limit); i++) {
      const event = response.data[i];
      let date = '';

      // Ensure that the event has a valid month, day, and year
      if (event.month && event.day && event.year) {
        // Handle negative years for BC
        if (event.year.toString().includes("-")) {
          event.year = event.year.toString().replace("-", "") + ' BC';
        }

        // Ensure the year is 4 digits (e.g., 0002 -> 0002, -45 -> 0045 BC)
        while (event.year.length !== 4) {
          event.year = "0" + event.year; // Prepend '0' until the year is 4 digits
        }

        // Format the date
        date = `${event.month}/${event.day}/${event.year}`;
      } else {
        // Fallback if month, day, or year is missing
        date = "Unknown Date"; // Can be customized if needed
      }

      historicalEvents.push({
        date,
        event: event.event,
      });
    }

    return historicalEvents; // Return the formatted events array
  } catch (error) {
    console.error("Error during historical events search:", error);
    throw error; // Ensure the error is thrown so it can be handled elsewhere
  }
}

//TEST
// getHistoricalEvents('china', 2).then(data => console.log(data))
// console.log(process.env)


module.exports = getHistoricalEvents;
