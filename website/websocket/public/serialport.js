var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
    //parsers: serialport.parsers.readline("\n")
});
const Readline = require('@serialport/parser-readline')
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', function(data) {
    var serial_stream = data;
    console.log(serial_stream);
});
