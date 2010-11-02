var sys = require('sys'),
		fs = require('fs'),
		path = require('path'),
		http = require('http'),
		ws = require('ws');		

// logging:
function pad (n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

function timestamp () {
  var d = new Date();
  return d.getHours() + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
};

function log (msg) {
  sys.puts(timestamp() + ' - ' + msg.toString());
};

var port = 8000;

var server = ws.createServer({
	debug: true
});

server.addListener('listening', function (){
	log('Listening for connections @ http://localhost:' + port);
});

// Handle WebSocket Requests
server.addListener('connection', function (conn) {
	log('opened connection: ' + conn.id);
  
	conn.addListener('message', function (message) {
		log('<'+conn.id+'> ' + message);
		server.broadcast(timestamp() + '\t' + message);
	});
});

server.addListener('close', function(conn){
	log('closed connection: ' + conn.id);
});

server.listen(port);