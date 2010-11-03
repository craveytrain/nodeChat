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

var connections = 0,
		ctrlChar = '/';

var port = 8000;

var server = ws.createServer();

server.addListener('listening', function (){
	// log('Listening for connections @ http://localhost:' + port);
});

// Handle WebSocket Requests
server.addListener('connection', function (conn) {
	connections++;
	server.broadcast(ctrlChar + 'connCount\t' + connections);
	// log('opened connection: ' + conn.id);
  
	conn.addListener('message', function (message) {
		if(message[0] == "/") {
			message = message.substring(1).split('\t');
			switch (message[0]) {
				case 'name':
					conn.storage.set("name", message[1]);
					break;
			}
		} else {
			// log('<'+conn.id+'> ' + message);
			server.broadcast(timestamp() + '\t' + conn.storage.get("name") + '\t' + message);
		}
	});
});

server.addListener('close', function(conn){
	connections--;
	server.broadcast(ctrlChar + 'connCount\t' + connections);
	// log('closed connection: ' + conn.id);
});

server.listen(port);