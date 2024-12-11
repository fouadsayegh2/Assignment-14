const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect('mongodb+srv://fouadsayegh:Fouad2005!@stock.uz7in.mongodb.net/?retryWrites=true&w=majority&appName=Stock', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const companySchema = new mongoose.Schema({
  name: String,
  ticker: String,
  price: Number,
});
const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;

  if (!searchBy || !search) {
    return res.status(400).send("Error: Missing search parameters.");
  }

  const query = searchBy === 'name'
    ? { name: new RegExp(search, 'i') }
    : { ticker: new RegExp(search, 'i') };

  try {
    const companies = await Company.find(query);

    if (!companies.length) {
      return res.status(404).send("No matching companies found.");
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<h1>Search Results</h1>");
    companies.forEach(company => {
      res.write(`
        <div style='margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;'>
          <strong>Name:</strong> ${company.name} <br>
          <strong>Ticker:</strong> ${company.ticker} <br>
          <strong>Price:</strong> $${company.price.toFixed(2)}
        </div>
      `);
    });
    res.end();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running and accessible at http://localhost:${port}`);
});
