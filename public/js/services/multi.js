'use strict';

setgame.factory('multi', ['user', '$rootScope', function(user, $rootScope) {

    var multi = {};

    var socket = io('http://' + window.location.hostname + ':8080', {'transports': ['websocket', 'polling']});

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

    multi.foundSet = function () {
      socket.emit('found set');
    };

    multi.userComplete = function (score) {
      socket.emit('user complete', score);
    };

    multi.gameOver = function () {
      socket.emit('game over');
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

    socket.on('user ready', function(user) {
      $rootScope.$emit('user ready', user);
    });

    socket.on('party time', function() {
      $rootScope.$emit('party time');
    });

    socket.on('found set', function(user) {
      $rootScope.$emit('found set', user);
    });

    socket.on('user complete', function(user, score) {
      $rootScope.$emit('user complete', user, score);
    });

    socket.on('game over', function() {
      $rootScope.$emit('game over');
    });



    return multi;
  }
]);
