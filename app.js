const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose
  .connect('mongodb+srv://fouadsayegh:Fouad2005!@stock.uz7in.mongodb.net/Stock?retryWrites=true&w=majority&appName=Stock', {
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
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;

  if (!searchBy || !search) {
    return res.status(400).send('Error: Missing search parameters.');
  }

  console.log(`SearchBy: ${searchBy}`);
  console.log(`Search: ${search}`);

  const query = searchBy === 'name'
    ? { name: new RegExp(search, 'i') }
    : { ticker: new RegExp(search, 'i') };

  console.log('Generated Query:', query);

  try {
    const companies = await Company.find(query);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Search Results</h1>');

    if (companies.length > 0) {
      companies.forEach(company => {
        res.write(`
          <div style='margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;'>
            <strong>Name:</strong> ${company.name} <br>
            <strong>Ticker:</strong> ${company.ticker} <br>
            <strong>Price:</strong> $${company.price.toFixed(2)}
          </div>
        `);
      });
    } else {
      res.write('<p>No matching companies found.</p>');
    }

    res.write('<br><a href="/">Return to Home</a>');
    res.end();
  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running and accessible at http://localhost:${port}`);
});
