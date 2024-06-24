const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const gptController = require('./gptController');

// serve static files
app.get(['/'], (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// generate response to the move that was played
app.get('/gpt/:playerMoveEncoded/:engineMoveEncoded', gptController.getKingMessage, (req, res) => {
  res.json(res.locals);
});

// handle unknown endpoints
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// global error handler
app.use((err, req, res, next) => {
  const errorMessage = err.err.toString();
  const errorLocation = `Error in ${err.function}`;
  res.status(500).json({
    errorMessage,
    errorLocation
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
}) 