module.exports.set = function(server) {

  var io = require('socket.io')(server);

  var lobbyUsers = [];

  io.on('connection', function(socket) {

    socket.on('join lobby', function(user) {
      console.log('joined: ' + user);
      addOrUpdateUser(user, socket.id);
    });

    socket.on('leave lobby', function() {
      removeUser(socket.id);
    });

    socket.on('disconnect', function() {
      removeUser(socket.id);
    });

    socket.on('get lobby', function(callback) {
      var activeUsers = lobbyUsers.filter(function(user) {
        // Filter out non-recent lobby users
        var now = new Date().getTime();
        return user.date > now - (60 * 60 * 1000);
      });

      callback(activeUsers);
    });

    socket.on('start game', function(user) {
      console.log('started game: ' + user);
      io.emit('start game', new Date().getTime());
    });

    function addOrUpdateUser(user, socketid) {
      if (!isInLobby(user)) {
        // If they're not already in the lob, add them
        var newUser = {
          username: user,
          socketid: socketid,
          date: new Date().getTime()
        };

        lobbyUsers.push(newUser);
        io.emit('join lobby', newUser);
      } else {
        // If they're already in the lobby, update their time
        updateTime(user);
      }
    }

    function isInLobby(username) {
      return indexOfUser(username) !== -1;
    }

    function updateTime(username) {
      var index = indexOfUser(username);
      lobbyUsers[index].date = new Date().getTime();
    }

    function indexOfUser(socketid) {
      return lobbyUsers.map(function(u) {
        return u.socketid;
      }).indexOf(socketid);
    }

    function removeUser(socketid) {
      var index = indexOfUser(socketid);
      var user = lobbyUsers.splice(index, 1)[0];

      if(user != null) {
        console.log("left lobby: " + user.username);
        io.emit('leave lobby', user);
      }
    }

  });



};
