const express = require('express');
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
// angular built static files
app.use(express.static(process.cwd()+"/checklist2-ui/dist/checklist2-ui/"));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.get('/', (req, res) => {
	res.sendFile(process.cwd()+"/checklist2-ui/dist/checklist2-ui/index.html")
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on the port::${PORT}`);
});