var num = 0;

function initSocket() {
    //socket is global
    socket = io.connect();
}

function sendMessage(total) {
    if(parseInt(total) >= 0){
        socket.emit("totalWaitingCalls", parseInt(total));
        num = parseInt(total);
    }
}

function startConv() {
    if (num > 0) {
        var tr = document.getElementById('openConversations').insertRow();
        var cStart = tr.insertCell(0);
        var cCity = tr.insertCell(1);
        var cTopic = tr.insertCell(2);
        var cLanguage = tr.insertCell(3);
        var cGender = tr.insertCell(4);
        var cAge = tr.insertCell(5);
        var cEnd = tr.insertCell(6);

        const date = Date.now();
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' })
        const [{ value: month }, , { value: day }, , { value: year }, , { value: hour }, , { value: minute }] = dateTimeFormat.formatToParts(date)
        cStart.innerHTML = "<div id='" + date + "''>" + `${day}-${month}-${year} ,${hour}:${minute}` + "</div>";
        var cityHtml = "<select id='city'>"
        for(city in cities)
            cityHtml += `<option value=${cities[city].cityEng}>${cities[city].cityHeb}</option>`
        cCity.innerHTML = cityHtml;
        var topicHtml = "<select id='topic'>"
        for(topic in topics)
            topicHtml += `<option value=${topics[topic].topicEng}>${topics[topic].topicHeb}</option>`
        cTopic.innerHTML = topicHtml;
        var langHtml = "<select id='language'>"
        for(lang in languages)
            langHtml += `<option value=${languages[lang].langEng}>${languages[lang].langHeb}</option>`
        cLanguage.innerHTML = langHtml;
        cAge.innerHTML = "<input type='number' min='1' max='120'/>";
        var genderHtml = "<select id='gender'>"
        for (g in genders)
            genderHtml += `<option value=${genders[g].genderEng}>${genders[g].genderHeb}</option>`
        cGender.innerHTML = genderHtml;
        cEnd.innerHTML = "<button onclick='reportEndCall(this.parentNode.parentNode)'>סיום</button>";
    }
    else alert("Set number of total waiting calls")
}

function reportEndCall(row) {
    var totalCalls = parseInt(document.getElementById("total").value) || 0;
    if (parseInt(totalCalls) > 0) {
        document.getElementById("total").value = (--totalCalls) + "";
        socket.emit("totalWaitingCalls", parseInt(totalCalls));
    }

    var message = {};
    message.id = row.cells[0].getElementsByTagName('div')[0].id;
    message.city = row.cells[1].getElementsByTagName('select')[0].value;
    message.topic = row.cells[2].getElementsByTagName('select')[0].value;
    message.language = row.cells[3].getElementsByTagName('select')[0].value;
    message.gender = row.cells[4].getElementsByTagName('select')[0].value;
    message.age = (row.cells[5].getElementsByTagName('input')[0].value || 18);
    message.totalTime = (parseInt(Date.now()) - parseInt(message.id)) / 1000; // seconds
    message.mood = (document.getElementById('mood').value);
    socket.emit("callDetails", message);
    deleteRow(row);
}

function deleteRow(row) {
    var i = row.rowIndex;
    document.getElementById('openConversations').deleteRow(i);
}

//module.exports.data = {cities,topics,languages,genders};