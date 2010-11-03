var sys = require('sys'),
		fs = require('fs'),
		path = require('path'),
		http = require('http'),
		ws = require('websocket-server');		

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

var connections = 0;

var port = 8000;

var server = ws.createServer({
	debug: true
});

server.addListener('listening', function (){
	// log('Listening for connections @ http://localhost:' + port);
});

// Handle WebSocket Requests
server.addListener('connection', function (conn) {
	connections++;
	server.broadcast('sys\t' + connections);
	// log('opened connection: ' + conn.id);
  
	conn.addListener('message', function (message) {
		// log('<'+conn.id+'> ' + message);
		server.broadcast(timestamp() + '\t' + message);
	});
});

server.addListener('close', function(conn){
	connections--;
	server.broadcast('sys\t' + connections);
	// log('closed connection: ' + conn.id);
});

server.listen(port);