const express = require("express");
const Ajv = require("ajv");

const PORT = 5000;

const app = express();
app.use(express.json())
app.use(require('./routes/update.js'))
app.use(require('./routes/converter.js'))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`)
})

