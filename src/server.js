// NPM MODULES
const path = require('path');  
const express = require('express');  
const dotenv = require('dotenv');  
const hbs = require('hbs');  

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
    title: 'Watch Tower',  
  });
});

// About Us route
app.get('/aboutus', (req, res) => {
  res.render('aboutUs', {  // Render the 'aboutUs' view
    title: 'Watch Tower',  
  });
});

// Login route
app.get('/login', (req, res) => {
  res.render('login', {  // Render the 'login' view
    title: 'Watch Tower',  
  });
});

// Sign-Up route
app.get('/signup', (req, res) => {
  res.render('signUp', {  // Render the 'signUp' view
    title: 'Watch Tower',  
  });
});

// Action route
app.get('/action', (req, res) => {
  res.render('action', {  // Render the 'action' view
    title: 'Watch Tower',  
  });
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
