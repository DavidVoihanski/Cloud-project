const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3333
var selection = require('./Views/sender');

//------------ kafka------------
const kafka = require('./Kafka/kafkaProduce');
const bodyParser = require('body-parser');
const { TLSSocket } = require('tls');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//------------ redis-------------
var sendData = require('./Redis4Ariel/RedisForArielReciver');
const sender = require ('./Redis4Ariel/RedisForArielSender');
const redisConnect = require ('./RedisConnector/RedisNode');

//-------------mongo----------------
var mongo = require("./Mongo/mongo")
var mongoConnector = require("./MongoConnector/MongoNode")

//--------------ejs---------------------
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.render('main'));
app.get('/send', (req, res) => res.render('sender'));
app.get('/view', (req, res) => res.render('viewer'));
app.get('/viewer.js', (req, res) => res.sendFile('Views/viewer.js', { root: __dirname }));
app.get('/main.css', (req, res) => res.sendFile('Views/main.css', { root: __dirname }));
app.get('/sender.js', (req, res) => res.sendFile('Views/sender.js', { root: __dirname }));
app.get('/viewer.css', (req, res) => res.sendFile('Views/viewer.css', { root: __dirname }));
app.get('/data.js', (req, res) => res.sendFile('Model/data.js', { root: __dirname }));


//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log("got new message in app.js: ", msg); kafka.publish(msg)});
    socket.on("callDetails", (msg) => { console.log(msg);kafka.publish(msg)});
});

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));
