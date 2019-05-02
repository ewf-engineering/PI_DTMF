var express = require('express')
  , http = require('http');
//make sure you keep this order
var app = express();
var server  = require('http').createServer(app);
const socketIO = require('socket.io').listen(server)
var io      = require('socket.io').listen(server);
audio_array = new Array(5).fill(0); //**globally declared array to be appended after each iteration s
var cnt = 0;
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
    //parsers: serialport.parsers.readline("\n")
});
const Readline = require('@serialport/parser-readline')
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', function(data) {
    var serial_stream = data.split(',');
    io.emit('audio_stream', serial_stream[0]);
    io.emit('dtmf_HL', serial_stream[1]);
    console.log(serial_stream);
});


var reload = require('reload')
//var server = require('http').createServer(app);
//var io = require('socket.io')(server)
app.set('appPath', 'public');
app.use(express.static(__dirname));

//http://localhost:80
app.route('/')
  .get(function(req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });

//reload
reload(app)
//// socket io ----------------------
io.on('connection', socket => {
  console.log('User connected')
  var lightvalue = 0; //static variable for current status
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    console.log(data)
  }) //socket light on



  socket.on('disconnect', () => {
    console.log('user disconnected')
  }) // socket disconnect
}) //io.on

//// end socket io ----------------------

server.listen('80', () => {
  console.log('Server listening on Port 3000');
})

/*
var server = app.listen(80, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening on port 80')
})
*/

/*
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)

http.listen(80); //listen to port 8080

function handler (req, res) { //create server
  fs.readFile(__dirname + '/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    console.log(data)
    if (lightvalue) {
      console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
    }
  });
}); */
