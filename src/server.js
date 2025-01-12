// NPM MODULES
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const getArtwork = require("./utils/getArt");
const getHistoricalEvents = require("./utils/getEvents");
const connection = require("../dbconfig.js");

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
// ROUTES

// Home route
app.get("/", (req, res) => {
	res.render("index", {
		// Render the 'index' view
		title: "Muse",
		description:
			"Welcome to Muse, where we challenge the growing influence of AI in the art world. Explore the rich history of human-created art and learn how AI is erasing traditional craftsmanship, overshadowing human creativity, and threatening the preservation of our artistic heritage.",
	});
});

// About Us route
app.get("/aboutus", (req, res) => {
	res.render("aboutus", {
		// Render the 'aboutUs' view
		title: "About Us",
		description:
			"Muse is committed to raising awareness about how AI is threatening the authenticity and legacy of human-made art. We believe that AI-driven art not only erases the value of history but also undermines the very essence of creative expression by displacing traditional artists.",
	});
});

// Login route
app.get("/login", (req, res) => {
	res.render("login", {
		// Render the 'login' view
		title: "Login",
		description:
			"Log in to ArtFuture to join the conversation on how AI is undermining the legacy of human-made art. If you're new, sign up to start learning about the dangers of AI-driven art and why it’s crucial to preserve our artistic history.",
	});
});

// Sign-Up route
app.get("/signup", (req, res) => {
	res.render("signup", {
		// Render the 'signUp' view
		title: "Sign up",
		description:
			"Sign up to become part of Muse's community that’s fighting to protect human creativity from the rise of AI in art. Gain access to discussions, resources, and tools dedicated to preserving the integrity of traditional art forms and the artists who created them.",
	});
});

// Action route
app.get("/resources", (req, res) => {
	res.render("resources", {
		// Render the 'resources' view
		title: "Resources",
		description:
			"Our resource library explores the evolving role of AI in the art world, examining both its potential and its challenges. We provide valuable insights into how AI is influencing traditional artistry and the preservation of historical techniques, fostering a thoughtful conversation about the future of art.",
	});
});

// Search route
app.get("/explore", (req, res) => {
	res.render("explore", {
		// Render the 'explore' view
		title: "Explore",
		description:
			"Browse Search for artworks from the Art Institute of Chicago’s collection and view key details like title, artist, and description. Descriptions are cleaned for clarity, and each artwork is displayed with a high-quality image. Explore the richness of human-made art while considering how AI is transforming the creative landscape. art that represents the legacy of human creativity and the ongoing battle against AI’s intrusion into the art world. Use our search tools to uncover how AI-generated art lacks the depth and humanity of traditional masterpieces, and see why preserving human-created art is more urgent than ever.",
	});
});

// Contact route
app.get("/contactus", (req, res) => {
	res.render("contactus", {
		// Render the 'explore' view
		title: "Contact Us",
		description:
			"Have questions about the Art Institute of Chicago’s collection? Reach out to us for details on artworks, artists, and how we’re preserving human creativity in an age of AI-driven art.",
	});
});

// Query route
app.get("/q", async (req, res) => {
	const q = req.query.q;

	if (!q) {
		return res.send("Error: Search query is required");
	}

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

app.post("/register", (req, res) => {
	const { firstname, lastname, email, password, repeatPassword } = req.body;

	if (!password) return res.send({ error: "Please enter password" });
	if (!email) return res.send({ error: "Please enter email" });
	if (!firstname) return res.send({ error: "Please enter first name" });
	if (!lastname) return res.send({ error: "Please enter last name" });

	if (password != repeatPassword) {
		return res.send({ error: "Password do not match!" });
	}

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
				res.redirect("/login");
			});
		}
	});
});

app.post("/signin", (req, res) => {
	const { email, password } = req.body;

	if (!password) return res.send({ error: "Please enter password" });
	if (!email) return res.send({ error: "Please enter email" });

	const selectEmailQ = `SELECT email, password, first_name, last_name, user_id FROM users WHERE email = '${email}'`;

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
		"INSERT INTO saved_searches (search_query, user_is) VALUES (?, ?)";
	const selectSaveSearchQ = `SELECT search_query FROM saved_searches WHERE user_id = ${user_id}`;
	const deleteSaveSearchQ = `DELETE FROM saved_searches WHERE search_id IN (SELECT search_id FROM saved_searches WHERE user_id = ${user_id} ORDER BY search_id ASC LIMIT 1)`;

	connection.query(insertQ, (err, result) => {
		if (err) throw err;
			connection.query(selectSaveSearchQ, (err, result) => {
				if (err) throw err;
        if (result.length > 0) {
          if (result.length >= 3) {
            connection.query(deleteSaveSearchQ, (err, result) => {
              if (err) throw err;
            });
          }
        }
			});
	});
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
