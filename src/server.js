// NPM MODULES
const path = require('path');  
const express = require('express');  
const dotenv = require('dotenv');  
const hbs = require('hbs');  
const getArtwork = require('./utils/getArt'); 
const getHistoricalEvents = require('./utils/getEvents'); 

// Load variables from the .env file
dotenv.config();

const app = express();

// LOCAL HOST PORT
const port = process.env.PORT;

// PATHING
const publicDirectory = path.join(__dirname, '../public');  // Path to the public folder for static assets
const viewsPath = path.join(__dirname, '../templates/views');  // Path to the views folder for Handlebars templates
const partialsPath = path.join(__dirname, '../templates/partials');  // Path to the partials folder for reusable components

// SET UP HANDLEBARS AND VIEWS LOCATION
app.set('views', viewsPath);  // Set the directory for views
app.set('view engine', 'hbs');  // Set Handlebars as the view engine
hbs.registerPartials(partialsPath);  // Register partials for reusable parts like header, footer, etc.

// SET UP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectory));  // Serve static files like CSS, JS, and images from the public folder

// ROUTES

// Home route
app.get('/', (req, res) => {
  res.render('index', {  // Render the 'index' view
    title: 'Muse',  
  });
});

// About Us route
app.get('/aboutus', (req, res) => {
  res.render('aboutus', {  // Render the 'aboutUs' view
    title: 'About Us',  
  });
});

// Login route
app.get('/login', (req, res) => {
  res.render('login', {  // Render the 'login' view
    title: 'Login',  
  });
});

// Sign-Up route
app.get('/signup', (req, res) => {
  res.render('signup', {  // Render the 'signUp' view
    title: 'Sign up',  
  });
});

// Action route
app.get('/resources', (req, res) => {
  res.render('resources', {  // Render the 'resources' view
    title: 'Resources',  
  });
});

// Search route
app.get('/explore', (req, res) =>{
  res.render('explore', {  // Render the 'explore' view
    title: 'Explore',  
  });
})

// Query route
app.get('/q', async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).send('Error: Search query is required');
  }

  try {
    // Fetch artworks
    const artworks = await getArtwork(q);
    
    // Get the number of artworks to fetch that many historical events
    const events = await getHistoricalEvents(q, artworks.length);

    // Return both the artworks and historical events
    return res.json({
      artworks,
      historicalEvents: events
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Error fetching data");
  }
});

// Non-existing routes
app.get('*', (req, res) => {
  res.render('404', {  // Render the '404' view 
    title: 'Page Not Found',  
  });
});

// CHECK SERVER IS UP
app.listen(port, () => { 
  console.log(`Server is up on port ${port}!`);  
});
