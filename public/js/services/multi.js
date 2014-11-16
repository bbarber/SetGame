'use strict';

setgame.factory('multi', ['user', '$rootScope', function(user, $rootScope) {

    var multi = {};

    var socket = io('/', {'transports': ['websocket', 'polling']});

    multi.joinLobby = function() {
      socket.emit('join lobby', user.currentUser);
    };

    multi.leaveLobby = function() {
      socket.emit('leave lobby', user.currentUser);
    };

    multi.getLobby = function(callback) {
      socket.emit('get lobby', function(lobbyUsers) {
        callback(lobbyUsers);
      });
    };

    multi.startGame = function () {
      socket.emit('start game', user.currentUser);
    };

    multi.ready = function (seed) {
      socket.emit('user ready', seed);
    };

    socket.on('join lobby', function(user) {
      $rootScope.$emit('join lobby', user);
    });

    socket.on('leave lobby', function(user) {
      $rootScope.$emit('leave lobby', user)
    });

    socket.on('start game', function(seed) {
      $rootScope.$emit('start game', seed);
    });

    socket.on('user ready', function(seedUser) {
      $rootScope.$emit('user ready', seedUser);
    });

    return multi;
  }
]);
