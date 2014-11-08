module.exports.set = function(server) {

  var io = require('socket.io')(server);

  io.on('connection', function(socket) {
    console.log('a user connected');
  });

};
