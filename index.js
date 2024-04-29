// Set up Express.js server
const express = require('express');
const app = express();
const port = 6060;

// Connect to PostgreSQL database
const { Pool } = require('pg');

const pool = new Pool({
  user: 'js',
  host: 'localhost',
  database: 'projekt2',
  password: 'js', // Updated password
  port: 5432,
});

// Fetch data from the database
app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT timestamp, pressure, height, temperature FROM sensordaten');
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).send('Error fetching data');
  }
});

// Structure the fetched data for Chart.js
app.get('/chart-data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT timestamp, height FROM sensordaten ORDER BY timestamp DESC LIMIT 20');
    const data = result.rows.map(row => ({
      x: new Date(row.timestamp).toISOString(), // Convert timestamp to ISO 8601 format
      y: row.height
    }));
    client.release();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).send('Error fetching data');
  }
});

// Serve static HTML file
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
