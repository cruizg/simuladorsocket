
const cISO8583 = require('ciso8583');
var net = require("net")
let iso8583Parser = new cISO8583();
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var server = net.createServer(function (connection) {
  console.log('client connected');
  connection.on('end', function () {
    console.log('client disconnected');
  });
  connection.on('data', function (data) {
    console.log('recepcionando data');
    let unpacked = iso8583Parser.unpack(data.toString());
    var proccessingCode = unpacked.dataElements["3"]
    console.log('proccessingCode: ' + proccessingCode)
    if (proccessingCode === null) {
      connection.write('No se encuentra processing code en la trama');
    } else {
      if (process.env[proccessingCode]===undefined) {
        connection.write('No hay se configuro trama');
      } else {
        connection.write(process.env[proccessingCode] || 'No hay Data');
      }
    }
  });

});

server.listen(server_port,server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
