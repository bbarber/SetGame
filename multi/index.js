module.exports.set = function(server) {

  var io = require('socket.io')(server);

  var lobbyUsers = [];
  var games = [];
  var inProgress = false;
  var currentGameLobby = [];

  io.on('connection', function(socket) {

    socket.on('join lobby', function(user) {
      console.log('joined: ' + user);
      addUser(user, socket.id);
    });

    socket.on('leave lobby', function() {
      removeUser(socket.id);
    });

    socket.on('disconnect', function() {
      removeUser(socket.id);
    });

    socket.on('get lobby', function(callback) {
      callback(lobbyUsers, inProgress);
    });

    socket.on('start game', function(user) {

      if(inProgress)
        return;

      inProgress = true;
      var seed = new Date().getTime();
      io.emit('start game', seed);

      currentGameLobby = [].concat(lobbyUsers);

      for (var i = 0; i < currentGameLobby.length; i++) {
        console.log('in the current game lobby: ' + currentGameLobby[i].username);
      }

    });

    socket.on('user ready', function() {

        var userIndex = currentGameLobby.map(function(u) {
          return u.socketid;
        }).indexOf(socket.id);

        if(userIndex !== -1) {
          currentGameLobby[userIndex].ready = true;
          io.emit('user ready', currentGameLobby[userIndex]);
        }

        var numReady = currentGameLobby.filter(function(u) {
          return u.ready;
        }).length;

        // If everyone is ready, party time!
        if(numReady === currentGameLobby.length) {
          io.emit('party time');
        }

    });

    socket.on('found set', function() {
      var userIndex = currentGameLobby.map(function(u) {
        return u.socketid;
      }).indexOf(socket.id);

      io.emit('found set', currentGameLobby[userIndex])
    });

    function addUser(user, socketid) {
      if (!isInLobby(user)) {
        // If they're not already in the lob, add them
        var newUser = {
          username: user,
          socketid: socketid,
          foundSets: 0
        };

        lobbyUsers.push(newUser);
        io.emit('join lobby', newUser);
      }
    }

    function isInLobby(username) {
      return indexOfUser(username) !== -1;
    }

    function indexOfUser(socketid) {
      return lobbyUsers.map(function(u) {
        console.log(u.username + ' ' + u.socketid);
        return u.socketid;
      }).indexOf(socketid);
    }

    function removeUser(socketid) {
      console.log('in removeuser: ' + socketid);
      var index = indexOfUser(socketid);

      if(index !== -1) {
        var user = lobbyUsers.splice(index, 1)[0];

        if(user != null) {
          console.log("left lobby: " + user.username);
          io.emit('leave lobby', user);
        }
      }
    }

  });



};
