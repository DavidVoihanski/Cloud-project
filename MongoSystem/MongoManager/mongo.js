const mongoose = require('mongoose'); 
io = require("socket.io-client");
client = io.connect("http://localhost:6666");

const URL = "mongodb+srv://usermame:password@mongodb.ictvj.mongodb.net/MongoDB?retryWrites=true&w=majority"
const connectDB = async () => {
    await mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true})
    console.log("connected to mongo...!")
}
connectDB();

// save without schema
var callRepoSchema = mongoose.Schema({}, { strict: false });
var callR = mongoose.model('CallReport', callRepoSchema);

client.on("endCallReport", (msg) => {
    callDetailsJson = JSON.parse(msg)
    console.log("end call report in mongo: ", msg);
    var newCall = new callR(callDetailsJson);
    newCall.save(function(err) {
        if (err) throw err;
        console.log('new call report successfully saved.');
    });
});