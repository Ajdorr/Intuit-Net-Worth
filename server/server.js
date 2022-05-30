const express = require("express");
const Ajv = require("ajv");

const PORT = 5000;

const app = express();
app.use(express.json())
app.use(require('./routes/update.js').router)
app.use(require('./routes/converter.js').router)

// General error handling
app.use((err, req, rsp, next) =>  {
  console.log(err)
  rsp.status(500).send("500 - Serverside error, please try later")
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`)
})

