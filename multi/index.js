module.exports.set = function(app, http) {

  var server = http.createServer(app).listen(8080);
  var io = require('socket.io')(server);

  var lobbyUsers = [];
  var inProgress = false;
  var currentGameLobby = [];
  var gameTimeout;

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

      currentGameLobby = [];
      for(var i = 0; i < lobbyUsers.length; i++) {
        currentGameLobby.push({
          username: lobbyUsers[i].username,
          socketid: lobbyUsers[i].socketid
        });
      }

      for (var i = 0; i < currentGameLobby.length; i++) {
        console.log('in the current game lobby: ' + currentGameLobby[i].username);
      }

      gameTimeout = setTimeout(function() {
        inProgress = false;
        io.emit('game over');
      }, (2 * 60 * 1000) + (23 * 1000) /* 23s of warmup time (max) */);
    });

    socket.on('user ready', function() {

        var userIndex = currentGameLobby.map(function(u) {
          return u.socketid;
        }).indexOf(socket.id);

        if(userIndex !== -1) {
          currentGameLobby[userIndex].ready = true;
          io.emit('user ready', currentGameLobby[userIndex]);
        }

        printLobby(currentGameLobby);
        printLobby(lobbyUsers);

        var numReady = currentGameLobby.filter(function(u) {
          return u.ready;
        }).length;

        console.log('numReady: ' + numReady);
        console.log('lobby size: ' + currentGameLobby.length);

        // If everyone is ready, party time!
        if(numReady === currentGameLobby.length) {
          io.emit('party time');
        }
    });

    function printLobby(lobby) {
      for (var i = 0; i < lobby.length; i++) {
        console.log(lobby[i]);
      }
    }

    socket.on('found set', function() {
      var userIndex = currentGameLobby.map(function(u) {
        return u.socketid;
      }).indexOf(socket.id);

      io.emit('found set', currentGameLobby[userIndex])
    });

    socket.on('user complete', function(score) {
      var userIndex = currentGameLobby.map(function(u) {
        return u.socketid;
      }).indexOf(socket.id);

      io.emit('user complete', currentGameLobby[userIndex], score);
    })

    socket.on('game over', function() {
      inProgress = false;
      clearTimeout(gameTimeout);
      io.emit('game over');
      currentGameLobby = [];
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
