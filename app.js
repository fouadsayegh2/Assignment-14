// Required modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://fouadsayegh:Fouad2005!@stock.uz7in.mongodb.net/?retryWrites=true&w=majority&appName=Stock', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Mongoose schema and model for "PublicCompanies"
const companySchema = new mongoose.Schema({
  name: String,
  ticker: String,
  price: Number,
});

const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// Route to serve homepage with form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Ensure "public/index.html" is present
});

// Route to process form submissions and query the database
app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;

  // Validate request parameters
  if (!searchBy || !search) {
    return res.status(400).send("Error: Missing search parameters.");
  }

  console.log(`SearchBy: ${searchBy}`);
  console.log(`Search: ${search}`);

  // Build query dynamically
  const query = searchBy === 'name' 
    ? { name: new RegExp(search, 'i') }  // Case-insensitive regex search by name
    : searchBy === 'ticker' 
    ? { ticker: new RegExp(search, 'i') } // Case-insensitive regex search by ticker
    : {};

  console.log('Generated Query:', query);

  try {
    const companies = await Company.find(query);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Search Results</h1>");

    if (companies.length > 0) {
      const companyHTML = companies.map(company => 
        `<div style='margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;'>
          <strong>Name:</strong> ${company.name} <br>
          <strong>Ticker:</strong> ${company.ticker} <br>
          <strong>Price:</strong> $${company.price.toFixed(2)}
        </div>`
      ).join('');
      res.write(companyHTML);
    } else {
      res.write("<p>No matching companies found.</p>");
    }

    res.write('<br><a href="/">Return to Home</a>');
    res.end();

  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server and listen on defined port
app.listen(port, () => {
  console.log(`Server is running and accessible at http://localhost:${port}`);
});
