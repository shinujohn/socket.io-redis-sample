// Module dependencies.

var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require('os');

var routes = require('./routes/index');
var app = module.exports = express();
server = http.createServer(app);

app.set('port', process.env.PORT || 3000);

// view engine setupnpod
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);
var redis = require('redis');
var pub = redis.createClient(6379,'oscdev1.redis.cache.windows.net', {auth_pass: 'sIqFh69j2+/wXL4nn8ZS6gPXBIXkbYE6XltIWj/tuVU=', return_buffers: true});
var sub = redis.createClient(6379,'oscdev1.redis.cache.windows.net', {auth_pass: 'sIqFh69j2+/wXL4nn8ZS6gPXBIXkbYE6XltIWj/tuVU=', return_buffers: true});

var redis = require('socket.io-redis');
io.adapter(redis({pubClient: pub, subClient: sub}));


io.sockets.on('connection', function(socket) {
  socket.on('message', function(data) {
      data = '[' + os.hostname() +' | ' + os.uptime() + '] ' + data;
      console.log(data);
      socket.broadcast.emit('message', data);
  });
  
  setInterval(function(){
  data = '[' + os.hostname() +' | ' + os.uptime() + '] ' + new Date();
  socket.broadcast.emit('message', data);
}, 5000);

});


