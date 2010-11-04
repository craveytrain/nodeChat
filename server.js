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
var client = http.createClient(7999, host='localhost');

server.addListener('listening', function () {
	log('Websocket server listening on port ' + port);
});

server.addListener('connection', function (conn) {
	connections++;
	server.broadcast(ctrlChar + 'connCount\t' + connections);
	log(connections + ' users connected');
  
	conn.addListener('message', function (message) {
		if(message[0] == "/") {
			message = message.substring(1).split('\t');
			switch (message[0]) {
				case 'name':
					conn.storage.set("name", message[1]);
					break;
			}
		} else {
			var request = client.request(method='POST', '/');
			request.end(conn.storage.get("name") + ': ' + message);
			server.broadcast(timestamp() + '\t' + conn.storage.get("name") + '\t' + message);
			log(conn.storage.get("name") + ': ' + message);
		}
	});
});

server.addListener('close', function(conn){
	connections--;
	server.broadcast(ctrlChar + 'connCount\t' + connections);
	log(connections + ' users connected');
});

server.listen(port);