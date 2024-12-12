// // Required modules
// const express = require('express');
// const mongoose = require('mongoose');

// // Initialize express app
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse URL-encoded data and serve static files
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://fouadsayegh:Fouad2005!@stock.uz7in.mongodb.net/Stock?retryWrites=true&w=majority&appName=Stock', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB successfully'))
// .catch((err) => console.error('Error connecting to MongoDB:', err));

// // Define Mongoose schema and model for "PublicCompanies"
// const companySchema = new mongoose.Schema({
//   name: String,
//   ticker: String,
//   price: Number,
// });

// const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// // Route to serve homepage with form
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html'); // Ensure "public/index.html" is present
// });

// // Route to process form submissions and query the database
// app.get('/process', async (req, res) => {
//   const { searchBy, search } = req.query;

//   // Validate request parameters
//   if (!searchBy || !search) {
//     return res.status(400).send("Error: Missing search parameters.");
//   }

//   console.log(`SearchBy: ${searchBy}`);
//   console.log(`Search: ${search}`);

//   // Build query dynamically
//   const query = searchBy === 'name' 
//     ? { name: new RegExp(search, 'i') }  // Case-insensitive regex search by name
//     : searchBy === 'ticker' 
//     ? { ticker: new RegExp(search, 'i') } // Case-insensitive regex search by ticker
//     : {};

//   console.log('Generated Query:', query);

//   try {
//     const companies = await Company.find(query);
    
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write("<h1>Search Results</h1>");

//     if (companies.length > 0) {
//       const companyHTML = companies.map(company => 
//         `<div style='margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;'>
//           <strong>Name:</strong> ${company.name} <br>
//           <strong>Ticker:</strong> ${company.ticker} <br>
//           <strong>Price:</strong> $${company.price.toFixed(2)}
//         </div>`
//       ).join('');
//       res.write(companyHTML);
//     } else {
//       res.write("<p>No matching companies found.</p>");
//     }

//     res.write('<br><a href="/">Return to Home</a>');
//     res.end();

//   } catch (error) {
//     console.error('Error retrieving companies:', error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Start server and listen on defined port
// app.listen(port, () => {
//   console.log(`Server is running and accessible at http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse request data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose
  .connect('mongodb+srv://fouadsayegh:Fouad2005!@stock.uz7in.mongodb.net/Stock?retryWrites=true&w=majority&appName=Stock', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schema and Model for PublicCompanies
const companySchema = new mongoose.Schema({
  name: String, // Name of the company
  ticker: String, // Ticker symbol
  price: Number, // Price of the stock
});
const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// Route: Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debugging Route: Process form submissions and display the generated query
app.get('/process', (req, res) => {
  const { searchBy, search } = req.query;

  // Validate the query parameters
  if (!searchBy || !search) {
    console.log("Error: Missing search parameters.");
    return res.status(400).send("Error: Missing search parameters.");
  }

  // Generate the query based on the parameters
  const query =
    searchBy === 'name'
      ? { name: new RegExp(search, 'i') } // Case-insensitive regex for name
      : { ticker: new RegExp(search, 'i') }; // Case-insensitive regex for ticker

  console.log("Generated Query:", query); // Log the generated query

  // Display the query parameters and the generated query on the page
  res.send(`
    <h1>Debugging Query</h1>
    <p><strong>Search By:</strong> ${searchBy}</p>
    <p><strong>Search Value:</strong> ${search}</p>
    <p><strong>Generated Query:</strong> ${JSON.stringify(query)}</p>
    <a href="/">Go Back</a>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running and accessible at http://localhost:${port}`);
});

// // Required modules
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');

// // Initialize express app
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse URL-encoded data and serve static files
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// // Make sure to replace 'your-mongodb-uri' with your actual connection string if you want to connect to a database.
// // If just debugging, you can comment this out.
// mongoose.connect('your-mongodb-uri', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB successfully'))
// .catch((err) => console.error('Error connecting to MongoDB:', err));

// // Define Mongoose schema and model for "PublicCompanies"
// const companySchema = new mongoose.Schema({
//   name: String,
//   ticker: String,
//   price: Number,
// });

// const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// // Route to serve homepage with form
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Debugging Route: Process form submissions and display the generated query
// app.get('/process', (req, res) => {
//   const { searchBy, search } = req.query;

//   // Validate request parameters
//   if (!searchBy || !search) {
//     console.log("Error: Missing search parameters.");
//     return res.status(400).send("Error: Missing search parameters.");
//   }

//   // Build query dynamically based on searchBy
//   const query =
//     searchBy === 'name'
//       ? { name: new RegExp(search, 'i') }
//       : { ticker: new RegExp(search, 'i') };

//   console.log("Generated Query:", query);

//   // Convert RegExp to a string for display purposes
//   let displayQuery;
//   if (query.name) {
//     displayQuery = `{"name": "${query.name.toString()}"}`;
//   } else if (query.ticker) {
//     displayQuery = `{"ticker": "${query.ticker.toString()}"}`;
//   } else {
//     displayQuery = JSON.stringify(query);
//   }

//   // Display the query parameters and generated query on the page
//   res.send(`
//     <h1>Debugging Query</h1>
//     <p><strong>Search By:</strong> ${searchBy}</p>
//     <p><strong>Search Value:</strong> ${search}</p>
//     <p><strong>Generated Query:</strong> ${displayQuery}</p>
//     <a href="/">Go Back</a>
//   `);
// });

// // Start server and listen on defined port
// app.listen(port, () => {
//   console.log(`Server is running and accessible at http://localhost:${port}`);
// });


