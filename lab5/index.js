const express = require('express');
const { join } = require('node:path');

const app = express();

app.use('/static', express.static('static'));

app.get('/', (request, response) => {
  response.sendFile(join(__dirname, 'templates', 'index.html'));
});

app.listen(3000, () => console.log('Server listening on port 3000.'));