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
      callback(lobbyUsers);
    });



    socket.on('start game', function(user) {

      if(inProgress)
        return;

      inProgress = true;

      var seed = new Date().getTime();


      io.emit('start game', seed);

      currentGameLobby = [];
      currentGameLobby.concat(lobbyUsers);

      for (var i = 0; i < currentGameLobby.length; i++) {
        console.log('in the game lobby: ' + currentGameLobby[i].username);
      }

    });

    socket.on('user ready', function(seed) {
      var gameIndex = games.map(function(g) {
        return g.seed;
      }).indexOf(seed);

      console.log("Ready w/ seed of: " + seed);
      console.log("gameIndex: ", gameIndex);
      console.log("games.length = ", games.length);

      if(gameIndex !== -1) {

        console.log(gameIndex);
        console.log(games);

        var lobby = games[gameIndex].lobby;

        console.log(lobby);

        var userIndex = lobby.map(function(u) {
          return u.socketid;
        }).indexOf(socket.id);

        if(userIndex !== -1) {
          lobby[userIndex].ready = true;
        }

        var numReady = lobby.map(function(u) {
          return u.ready;
        }).length;

        io.emit('user ready', {seed: seed, user: lobby[indexOfUser(socket.id)]});

        // If everyone is ready, party time!
        if(numReady === lobby.length) {
          io.emit('party time', seed);
        }
      }
    });

    function addUser(user, socketid) {
      if (!isInLobby(user)) {
        // If they're not already in the lob, add them
        var newUser = {
          username: user,
          socketid: socketid
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
