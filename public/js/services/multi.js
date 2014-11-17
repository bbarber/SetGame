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
      socket.emit('get lobby', function(lobbyUsers, inProgress) {
        callback(lobbyUsers, inProgress);
      });
    };

    multi.startGame = function () {
      socket.emit('start game', user.currentUser);
    };

    multi.ready = function () {
      socket.emit('user ready');
    };

    socket.on('join lobby', function(user) {
      $rootScope.$emit('join lobby', user);
    });

    socket.on('leave lobby', function(user) {
      $rootScope.$emit('leave lobby', user)
    });

    socket.on('start game', function() {
      $rootScope.$emit('start game');
    });

    socket.on('user ready', function(user) {
      $rootScope.$emit('user ready', user);
    });

    socket.on('party time', function(seed) {
      $rootScope.$emit('party time', seed);
    });


    return multi;
  }
]);
