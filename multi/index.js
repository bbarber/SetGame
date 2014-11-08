module.exports.set = function(server) {

  var io = require('socket.io')(server);

  var lobbyUsers = [];

  io.on('connection', function(socket) {

    socket.on('join lobby', function(user) {
      console.log('joined: ' + user);
      addOrUpdateUser(user);
      updateLobby();
    });

    socket.on('leave lobby', function(user) {
      console.log('left: ' + user);
      removeUser(user);
      updateLobby();
    });

    function addOrUpdateUser(user) {
      if (!isInLobby(user)) {
        // If they're not already in the lob, add them
        lobbyUsers.push({
          username: user,
          date: new Date().getTime()
        });
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

    function indexOfUser(username) {
      return lobbyUsers.map(function(u) {
        return u.username;
      }).indexOf(username);
    }

    function removeUser(username) {
      var index = indexOfUser(username);
      lobbyUsers.splice(index, 1);
    }

    function updateLobby() {
      var activeUsers = lobbyUsers.filter(function(user) {
        // Filter out non-recent lobby users
        var now = new Date().getTime();
        return user.date > now - (60 * 60 * 1000);
      });

      console.log(activeUsers);
      io.emit('lobby users', activeUsers);
    }

  });



};
