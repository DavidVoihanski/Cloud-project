const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = 3333

const callCenterManager = require('./CallCenterConnector/CallCenterNode');


//--------------ejs---------------------
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.render('CallCenter'));
app.get('/CallCenterController.js', (req, res) => res.sendFile('Controller/CallCenterController.js', { root: __dirname }));
app.get('/data.js', (req, res) => res.sendFile('Model/data.js', { root: __dirname }));


server.listen(port, () => console.log(`Call center app listening at http://localhost:${port}`));

