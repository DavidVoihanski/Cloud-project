Big data project - represents a call center which is written using MVC design pattern, and includes three systems:

1) CallCenterInputSystem - Node.js EXPRESS server which serves a JS, EJS (using EJS view engine) & CSS  UI for "answering (reciving) calls", all clients are updated in real time using socketIO, this system is used to create the data, this data is then passed to KAFKA message broker which is hosted on cloudkarafka cloud, the data is passed to two KAFKA topics - Mongo and Redis.

2) RedisSystem - Node.js EXPRESS server which recives data from KAFKA (CallCenterInputSystem), stores it in REDIS which runs in a Docker container, and serves a NRT 24-hour dashboard (using chart.js graphing library), updated in read time using SocketIO.

3) MongoSystem - recives data from KAFKA (CallCenterInputSystem) at mongo topic, stores it in Mongo which is hosted on Mongodb atlas cloud.
