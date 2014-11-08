'use strict';

setgame.factory('multi', ['user', function(user) {

    var multi = {};

    var socket = io('/', {'transports': ['websocket', 'polling']});

    multi.joinLobby = function() {
      socket.emit('join lobby', user.currentUser);
    };

    multi.leaveLobby = function() {
      socket.emit('leave lobby', user.currentUser);
    };

    socket.on('lobby users', function(users){
      console.log(users);
    });

    return multi;
  }
]);
