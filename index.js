var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var server = require("http").Server(app);
//var io = require('socket.io')(server);

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({server: server});

server.listen(9000);

nodeMcuID = {};

var deviceState = {};
deviceState.device1 = "off"
deviceState.device2 = "off"


wss.on('connection', function (ws, req){
    var id = req.headers['sec-websocket-key'];
    nodeMcuID = id;
    //var ip = req.connection.remoteAddress;
    console.log("Co nguoi ket noi toi voi socket ID: " + id);
    ws.on('close', function(){
        console.log("Disconnect");
    })
    ws.on('message', function incoming(message) {
        console.log(message);
        if(message == "register"){
            nodeMcuID = ws;
            console.log("NodeMCU da ket noi");
        }
    });
})

app.get('/', function (req, res) {
    res.render("trangchu");
});

app.get('/deviceon1', function (req, res) {
    deviceState.device1 = "on";
    nodeMcuID.send("1on")
});

app.get('/deviceon2', function (req, res) {
    deviceState.device2 = "on";
    nodeMcuID.send("2on")
});

app.get('/deviceoff1', function (req, res) {
    deviceState.device1 = "off";
    nodeMcuID.send("1off")
});

app.get('/deviceoff2', function (req, res) {
    deviceState.device2 = "off";
    nodeMcuID.send("2off")
});


