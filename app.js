
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy')

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
}

if ('production' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chatPage', routes.chatPage);

var server = http.createServer(app)
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var users = {};
io.sockets.on('connection', function(socket) {
	socket.on("add user", function(username) {
		socket.username = username;
		socket.userId = users.length;

		users[username] = {
			userName : username,
			userId : users.length
		};

		socket.emit("send message", "system", " welcome!");

		socket.broadcast.emit("send message", "system", username + " is connected!");

		io.sockets.emit("update users", users);
	});

	socket.on("disconnect", function() {
		delete users[socket.username];

		io.sockets.emit("update users", users);

		socket.broadcast.emit("send message", "system", socket.username + " is out! :(");
	});

	socket.on("send message", function(data) {
		io.sockets.emit("send message", socket.username, data);
	});
});
