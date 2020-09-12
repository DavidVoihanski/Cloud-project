
var redis = require('redis');
var redisClient = redis.createClient();

var cities = [{
    cityEng: "jerusalem",
    cityHeb: "ירושלים"
},
{
    cityEng: "naaria",
    cityHeb: "נהריה"
},
{
    cityEng: "haifa",
    cityHeb: "חיפה"
},
{
    cityEng: "telAviv",
    cityHeb: "תל אביב"
},
{
    cityEng: "ashdod",
    cityHeb: "אשדוד"
},
{
    cityEng: "ashkelon",
    cityHeb: "אשקלון"
},
{
    cityEng: "beerSheva",
    cityHeb: "באר שבע"
},
{
    cityEng: "netanya",
    cityHeb: "נתניה"
}
]

var topics = [{
    topicEng: "Medical",
    topicHeb: "טיפול רפואי"
},
{
    topicEng: "drugs",
    topicHeb: "תרופות"
},
{
    topicEng: "food",
    topicHeb: "מזון"
},
{
    topicEng: "water",
    topicHeb: "מים"
},
{
    topicEng: "shelter",
    topicHeb: "מיגון"
},
{
    topicEng: "information",
    topicHeb: "מידע"
},
{
    topicEng: "evacuation",
    topicHeb: "פינוי"
}
]

var languages = [{
    langEng: "hebrew",
    langHeb: "עברית"
},
{
    langEng: "english",
    langHeb: "אנגלית"
},
{
    langEng: "amharic",
    langHeb: "אמהרית"
},
{
    langEng: "russian",
    langHeb: "רוסית"
},
{
    langEng: "arabic",
    langHeb: "ערבית"
},
{
    langEng: "thai",
    langHeb: "תאילנדית"
}
]

var genders = [{
    genderEng: "male",
    genderHeb: "גבר"
},
{
    genderEng: "female",
    genderHeb: "אישה"
}]

async function getTotalWaitingCalls(){
    var totalWaitingCalls = -1;
    let response = await redisClient.getAsync("totalWaiting");
    console.log(response)
    if (response == null){
        totalWaitingCalls = 0;
    }
    else{
        totalWaitingCalls = response;
    }
    console.log(totalWaitingCalls)
    return totalWaitingCalls;
}

async function getAverageWaitTime(){
    var averageWaitTime = -1;
    let keys = await redisClient.keysAsync('wait*');
    console.log("Keys: ", keys)
    var sum = 0;
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        sum += parseFloat(response);
    }
    averageWaitTime = sum/keys.length;
    if (Number.isNaN(averageWaitTime)) averageWaitTime = 0;
    return averageWaitTime;
}

async function getNumberOfCallsPerLanguage(){
    var langArray = []
    for(lang in languages)
        langArray.push(languages[lang].langEng);
    var countsLangArray = []
    for(lang in langArray){
        let response = await redisClient.getAsync('lang-'+langArray[lang]);
        if(response == null) countsLangArray.push(0);
        else countsLangArray.push(parseInt(response));
    }
    return [langArray, countsLangArray];
}

async function getNumberOfCallsPerTopic(){
    var topicArray = []
    for(topic in topics)
        topicArray.push(topics[topic].topicEng);
    var countsTopicArray = []
    for(topic in topicArray){
        let response = await redisClient.getAsync('topic-'+topicArray[topic]);
        if(response == null) countsTopicArray.push(0);
        else countsTopicArray.push(parseInt(response));
    }
    return [topicArray, countsTopicArray];
}

async function getNumberOfCallsPerCity(){
    var citiesArray = []
    for(city in cities)
        citiesArray.push(cities[city].cityEng);
    var countsCityArray = []
    for(city in citiesArray){
        let response = await redisClient.getAsync('city-'+citiesArray[city]);
        if(response == null) countsCityArray.push(0);
        else countsCityArray.push(parseInt(response));
    }
    return [citiesArray, countsCityArray];
}

module.exports = {getTotalWaitingCalls, getAverageWaitTime, getNumberOfCallsPerCity, getNumberOfCallsPerTopic, getNumberOfCallsPerLanguage };
