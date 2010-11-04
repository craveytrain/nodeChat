var sys = require('sys'),
		http = require('http');

var hostname = 'localhost',
		port = 7999;

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


var server = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	req.addListener('data', function(data){
		log(req.method + ': ' + data.toString());
		res.end();
	});
});

server.listen(port, hostname, function(){
	sys.puts('Webservice or whatever running at http://' + hostname + ':' + port);
});