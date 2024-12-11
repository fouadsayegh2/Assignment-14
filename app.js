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
  name: String,
  ticker: String,
  price: Number,
});
const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// Route: Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Process form submission and query database
app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;

  // Check for missing query parameters
  if (!searchBy || !search) {
    console.log("Error: Missing search parameters.");
    return res.status(400).send("Error: Missing search parameters.");
  }

  // Generate the query based on search criteria
  const query =
    searchBy === 'name'
      ? { name: new RegExp(search, 'i') } // Case-insensitive search by name
      : { ticker: new RegExp(search, 'i') }; // Case-insensitive search by ticker

  console.log("Generated Query:", query); // Log the query for debugging

  try {
    // Execute the query
    const companies = await Company.find(query);
    console.log("Query Results:", companies); // Log query results

    if (!companies.length) {
      console.log("No matching companies found.");
      return res.status(404).send("No matching companies found.");
    }

    // Render the results
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Search Results</h1>");
    companies.forEach((company) => {
      res.write(`
        <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
          <strong>Name:</strong> ${company.name} <br>
          <strong>Ticker:</strong> ${company.ticker} <br>
          <strong>Price:</strong> $${company.price.toFixed(2)}
        </div>
      `);
    });
    res.end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running and accessible at http://localhost:${port}`);
});
