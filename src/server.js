// NPM MODULES
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const fs = require('fs')
const getArtwork = require("./utils/getArt");
const getHistoricalEvents = require("./utils/getEvents");
const aiOrNot = require('./utils/aiOrNot.js')
const fileUpload = require('express-fileupload');
const connection = require("../dbconfig.js");
const Buffer = require('buffer')

// Load variables from the .env file
dotenv.config();

const app = express();

// LOCAL HOST PORT
const port = process.env.PORT;

// PATHING
const publicDirectory = path.join(__dirname, "../public"); // Path to the public folder for static assets
const viewsPath = path.join(__dirname, "../templates/views"); // Path to the views folder for Handlebars templates
const partialsPath = path.join(__dirname, "../templates/partials"); // Path to the partials folder for reusable components

// SET UP HANDLEBARS AND VIEWS LOCATION
app.set("views", viewsPath); // Set the directory for views
app.set("view engine", "hbs"); // Set Handlebars as the view engine
hbs.registerPartials(partialsPath); // Register partials for reusable parts like header, footer, etc.

// SET UP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectory)); // Serve static files like CSS, JS, and images from the public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload())

// app.use(
// 	fileUpload({
// 			limits: {
// 					fileSize: 10000000,
// 			},
// 			abortOnLimit: true,
// 	})
// );

// ROUTES

// Home route
app.get("/", (req, res) => {
	res.render("index", {
		// Render the 'index' view
		title: "Muse",
		description: `“The purpose of art is washing the dust of daily life off our souls.” – Pablo Picasso.`,
	});
});

// About Us route
app.get("/aboutus", (req, res) => {
	res.render("aboutUs", {
		// Render the 'aboutUs' view
		title: "About Us",
		description:` "I never painted my dreams, I painted my own reality" -  Frida Kahlo`	});
});

// Login route
app.get("/login", (req, res) => {
	res.render("login", {
		// Render the 'login' view
		title: "Login"
	});
});

// Admin route
app.get("/admin", (req, res) => {
	res.render("admin", {
		// Render the 'login' view
		title: "Admin",
		description:
			`"I dream of painting and then I paint my dream". Van Gogh also said, "I am seeking. I am striving. I am in it with all my heart".`,
	});
});

// Sign-Up route
app.get("/signup", (req, res) => {
	res.render("signup", {
		// Render the 'signUp' view
		title: "Sign up"
	});
});

// Action route
app.get("/resources", (req, res) => {
	res.render("resources", {
		// Render the 'resources' view
		title: "Resources",
		description:
			"Every artist was first an amateur.” ― Ralph Waldo Emerson",
	});
});

// Search route
app.get("/explore", (req, res) => {
	res.render("explore", {
		// Render the 'explore' view
		title: "Explore",
		description: `"No great artist ever sees things as they really are. If he did, he would cease to be an artist" - Oscar Wilde`
	});
});

// Contact route
app.get("/contactus", (req, res) => {
	res.render("contactus", {
		// Render the 'explore' view
		title: "Contact Us"
	});
});

// Query route
app.get("/q", async (req, res) => {
	const q = req.query.q;

	if (!q) return res.send("Error: Search query is required");

	try {
		// Fetch artworks
		const artworks = await getArtwork(q);

		// Get the number of artworks to fetch that many historical events
		const events = await getHistoricalEvents(q, artworks.length);

		// Return both the artworks and historical events
		return res.json({
			artworks,
			historicalEvents: events,
		});
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).send("Error fetching data");
	}
});

app.get('/getMessages', (req, res) =>{

	const selectMessages = `SELECT * FROM contact_us`

	connection.query(selectMessages, (err, result) => {
		if (err) throw err;
		return res.send({
			messages: result
		})
	})
})

app.post("/register", (req, res) => {
	const { firstname, lastname, email, password } = req.body;

	if (!password) return res.send({ error: "Please enter password" });
	if (!email) return res.send({ error: "Please enter email" });
	if (!firstname) return res.send({ error: "Please enter first name" });
	if (!lastname) return res.send({ error: "Please enter last name" });


	const insertQ =
		"INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

	const selectEmailQ = `SELECT email FROM users WHERE email = '${email}'`;

	const values = [firstname, lastname, email, password];

	connection.query(selectEmailQ, (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			return res.send({ error: "Email in use!" });
		} else {
			connection.query(insertQ, values, (err, result) => {
				if (err) throw err;
				return res.send({success: "Success!"})
			});
		}
	});
});

app.post("/signin", (req, res) => {
	const { email, password } = req.body;

	if (!password) return res.send({ error: "Please enter password" });
	if (!email) return res.send({ error: "Please enter email" });

	const selectEmailQ = `SELECT email, password, first_name, last_name, user_id, is_admin FROM users WHERE email = '${email}'`;

	connection.query(selectEmailQ, (err, result) => {
		if (err) throw err;

		if (result.length > 0) {
			if (password !== result[0].password) {
				return res.send({ error: "Password is incorrect" });
			} else {
				return res.send({ userData: result[0] });
			}
		} else {
			return res.send({ error: "No account with email provided" });
		}
	});
});

app.post("/saveSearch", (req, res) => {
	const { search_query, user_id } = req.body;

	if (!search_query) return res.send({ error: "Please enter search" });

	const insertQ =
		"INSERT INTO saved_searches (search_query, user_id) VALUES (?, ?)";
	const values = [search_query, user_id];
	const selectSaveSearchQ = `SELECT search_query FROM saved_searches WHERE user_id = ${user_id}`;
	const deleteSaveSearchQ = `DELETE FROM saved_searches WHERE user_id = ${user_id} ORDER BY search_id ASC LIMIT 1;`;

	connection.query(insertQ, values, (err, result) => {
		if (err) throw err;
			connection.query(selectSaveSearchQ, (err, result) => {
				if (err) throw err;
				if (result.length > 3) {
					connection.query(deleteSaveSearchQ, (err, result) => {
						if (err) throw err;
					});
        }
			});
	});
});

app.get("/getSearch", (req, res) =>{
	const user_id = req.query.user_id

	const selectSaveSearchQ = `SELECT search_query FROM saved_searches WHERE user_id = ${user_id}`;

		connection.query(selectSaveSearchQ, (err, result) => {
			if(err) throw err;
			return res.send(result)
		})
		

})


app.post('/contactMessage', (req, res) =>{
	const {user_id, full_name, email, message} = req.body

	if(user_id){
		app.get('/getFullName', (req, res) =>{
			const {user_id,  first_name,  last_name} = req.body  
			const selectIdQ = `SELECT first_name, last_name FROM users WHERE user_id = ${user_id}`
			connection.query(selectIdQ, (err, result)  =>{
				full_name = first_name + ' ' + last_name
			})
		})
	}

	const insertQ = "INSERT INTO contact_us (user_id, full_name, email, message) VALUES (?, ?, ?, ?)";

	const values = [user_id, full_name, email, message];

	connection.query(insertQ, values, (err, result) => {
		if (err) throw err;
		res.send({success: 'Success!'})
	})

})

app.post('/aiOrNot', async (req, res) => {
  // Check if the 'image' file exists
  if (!req.files || !req.files.image) {
    return res.status(400).send({ error: 'No image file uploaded' });
  }

  // Get the file from req.files
  const { image } = req.files;

  // Ensure the file is an image
  if (!/^image/.test(image.mimetype)) {
    return res.status(400).send({ error: 'Invalid file type, only images allowed' });
  }

  // Resolve the absolute path for the 'public/userImages' directory
  const dirPath = path.resolve(__dirname, 'public', 'userImages');
  console.log('Resolved directory path:', dirPath);  // Debugging line

  // Ensure the 'userImages' directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('Created directory:', dirPath);
  }

  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${image.name}`;
  const filePath = path.join(dirPath, uniqueFileName);
  console.log('File path to save image:', filePath);  // Debugging line

  try {
    // Move the uploaded file to the desired location
    await image.mv(filePath);

    // Read the file and convert it to base64
    const imageBuffer = fs.readFileSync(filePath);
    const imageBase64 = imageBuffer.toString('base64');

    // Call the AI function to process the image
    const data = await aiOrNot(filePath);

    // Check if AI function returned an error
    if (data.error) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File successfully deleted after processing');
        }
      });

      return res.status(500).send({ error: data.error });
    }

    // Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File successfully deleted after processing');
      }
    });

    // Send the result back to the client
    return res.send({
      aiProbability: data,
      imageBase64: imageBase64,
      imageMimeType: image.mimetype,
    });

  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send({ error: 'Failed to move or process image' });
  }
});


// Non-existing routes
app.get("*", (req, res) => {
	res.render("404", {
		// Render the '404' view
		title: "Page Not Found",
	});	
});

// CHECK SERVER IS UP
app.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});
