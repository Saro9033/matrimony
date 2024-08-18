require('dotenv').config();
const mongoose = require('mongoose')
const app = require('./app')
const http = require('http');
const setupSocketIo = require('./utils/setSocket');
const path = require('path');
const express = require('express');


const buildPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

// For all other requests, serve the Vite-built index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

mongoose.connect(process.env.MONGO_URL, {
  // Use default options for recent versions
  //useNewUrlParser: true,
 // useUnifiedTopology: true
}).then(() => {
  const server = http.createServer(app);
  setupSocketIo(server);
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} and running in ${process.env.NODE_ENV}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});