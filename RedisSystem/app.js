const express = require('express');
const app = express();
var server = require('http').createServer(app);
const port = 3334

const redisReceiver = require('./Model/RedisForArielReciver');
const redisSender = require ('./Model/RedisForArielSender');
const redisConnect = require ('./RedisConnector/RedisNode');

//--------------ejs---------------------
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.render('Dashboard'));
app.get('/DashboardController.js', (req, res) => res.sendFile('Controller/DashboardController.js', { root: __dirname }));
app.get('/Dashboard.css', (req, res) => res.sendFile('Views/Dashboard.css', { root: __dirname }));


server.listen(port, () => console.log(`Redis app listening at http://localhost:${port}`));
