'use strict';

setgame.controller('HomeController', ['$scope', '$location', '$window', '$rootScope', '$interval', '$timeout', 'common', 'engine', 'user', 'GameApi', 'card', 'multi',
  function($scope, $location, $window, $rootScope, $interval, $timeout, common, engine, user, GameApi, card, multi) {

    $scope.isPractice = common.isPractice();
    $scope.isMultiPlayer = common.isMultiPlayer();
    $scope.isStartPressed = false;

    var offSetHours = new Date().getTimezoneOffset();
    $scope.seed = parseInt((new Date().getTime() / (1000 * 60) - offSetHours) / (60 * 24), 10);

    // If practice, use current time to seed, otherwise use daily seed
    Math.seedrandom($scope.isPractice ? Date.now() : $scope.seed);


    $scope.start = function() {

      $scope.foundSets = [];
      $scope.existingSets = [];

      if ($scope.isPractice || user.isLoggedIn) {

        var board = engine.createBoard();

        // Format a little, easier for the UI
        $scope.board = [
          [board[0], board[1], board[2], board[3]],
          [board[4], board[5], board[6], board[7]],
          [board[8], board[9], board[10], board[11]]
        ];

        $scope.isStarted = true;
        $scope.startTime = new Date().getTime();
      } else {
        // If they want to play non-practice
        // they must be logged in first
        $scope.showLogins = true;
      }
    };

    $scope.login = function(auth) {
      $window.location.href = 'auth/' + auth;
    };


    $scope.toImg = function(c) {
      return card.toImg(c);
    };

    var selectedCards = [];

    $scope.foundSets = [];

    $scope.toggleSelection = function(selectedCard) {
      selectedCard.isSelected = !selectedCard.isSelected;

      if (selectedCard.isSelected) {
        selectedCards.push(selectedCard);
      }

      // Remove the card, if it gets un-selected
      if (!selectedCard.isSelected) {
        var index = selectedCards.indexOf(selectedCard);
        if (index !== -1) {
          selectedCards.splice(index, 1);
        }
      }


      if (selectedCards.length === 3) {
        checkValidity();
        clearSelection();
      }

      if ($scope.foundSets.length === 6) {
        winning();
      }

    };

    function clearSelection() {
      angular.forEach(selectedCards, function(c) {
        c.isSelected = false;
      });
      selectedCards = [];
    }

    function checkValidity() {
      if (isDuplicateSet(selectedCards)) {
        alert("Already found");
      } else if (!engine.isValidSet(selectedCards)) {
        alert('Not valid set');
      } else {
        $scope.foundSets.push(selectedCards);

        if ($scope.isMultiPlayer) {
          multi.foundSet();
        }
      }
    }

    function isDuplicateSet(selectedCards) {

      var existingSets = [];

      angular.forEach($scope.foundSets, function(foundSet) {
        existingSets.push(foundSet.map(function(c) {
          return card.toImg(c);
        }).sort());
      });


      var selected = selectedCards.map(function(c) {
        return card.toImg(c);
      }).sort();


      for (var i in existingSets) {

        var existingSet = existingSets[i];

        // At this point, they're sorted, so we can compare directly
        if (existingSet[0] === selected[0] && existingSet[1] === selected[1] && existingSet[2] === selected[2]) {
          return true;
        }
      };

      return false;
    }

    function winning() {
      var endTime = new Date().getTime();
      $rootScope.score = (endTime - $scope.startTime) / 1000;

      if (!$scope.isPractice && !$scope.isMultiPlayer) {
        GameApi.saveScore({
          username: localStorage['hero'],
          score: $rootScope.score,
          seed: $scope.seed
        });

        // Navigate to the stats page so they can see their score
        $location.path('/stats');
      }

      if ($scope.isMultiPlayer) {
        multi.userComplete($rootScope.score);
        $scope.heroComplete = true;
        $scope.isStarted = false;
      }
    }

    $scope.lobbyUsers = [];

    if (common.isMultiPlayer()) {
      multi.getLobby(function(lobbyUsers, inProgress) {
        $scope.inProgress = inProgress;
        $scope.lobbyUsers = lobbyUsers;
        multi.joinLobby();
      });
    }

    $scope.startMulti = function() {
      if (!$scope.isStartPressed) {
        multi.startGame();
      } else {
        $scope.heroReady = true;
        multi.ready();
      }
    };

    $scope.replayMulti = function() {
      $scope.showResults = false;
      $scope.heroReady = false;
      $scope.isStarted = false;
      $scope.inProgress = false;
      $scope.isStartPressed = false;
      $scope.heroComplete = false;

      multi.getLobby(function(lobbyUsers, inProgress) {
        $scope.inProgress = inProgress;
        $scope.lobbyUsers = lobbyUsers;
        $scope.$apply();
      });
    };

    var multCleanup = $scope.$on('$locationChangeSuccess', function() {
      if (!common.isMultiPlayer()) {
        multi.leaveLobby();
      }
    });

    var joinCleanup = $rootScope.$on('join lobby', function(event, user) {
      if (!$scope.isStartPressed) {
        $scope.lobbyUsers.push(user);
        $scope.$apply();
      }
    });

    var leaveCleanup = $rootScope.$on('leave lobby', function(event, user) {
      if (!$scope.isStartPressed) {
        var index = $scope.lobbyUsers.map(function(u) {
          return u.socketid;
        }).indexOf(user.socketid);

        $scope.lobbyUsers.splice(index, 1)[0];
        $scope.$apply();
      }
    });

    var startCleanup = $rootScope.$on('start game', function(event, seed) {

      if (!$scope.isStartPressed) {
        console.log('someone started the game');
        $scope.isStartPressed = true;

        // Start the timer, fire the lazers!
        $scope.readyTimerValue = 20;
        $scope.seed = seed;
        $scope.timer20 = $interval(updateTime, 1000);

        $scope.$apply();
      }

    });

    function updateTime() {
      $scope.readyTimerValue = $scope.readyTimerValue - 1;
      if ($scope.readyTimerValue <= 0) {
        $scope.readyTimerValue = null;
        $interval.cancel($scope.timer20);
        startPuzzle();
      }
    }

    function updateGoTime() {
      $scope.goTimer = $scope.goTimer - 1;

      if ($scope.goTimer === 0) {

        // When the puzle start, remove checkmark
        angular.forEach($scope.lobbyUsers, function(user) {
          user.ready = false;
        });

        $scope.start();
      }

      // Give them 2mins to complete the puzzle
      if ($scope.goTimer === (-1 * 2 * 60)) {
        gameOver();
      }


    }

    var readyCleanup = $rootScope.$on('user ready', function(event, user) {

      var userIndex = $scope.lobbyUsers.map(function(u) {
        return u.socketid;
      }).indexOf(user.socketid);
      console.log('user is ready: ' + $scope.lobbyUsers[userIndex].username);
      $scope.lobbyUsers[userIndex].ready = true;
      $scope.$apply();
    });

    var partyCleanup = $rootScope.$on('party time', function() {
      console.log("Party time! Excellent!");
      startPuzzle();
      $scope.$apply();
    });

    var foundCleanup = $rootScope.$on('found set', function(event, user) {
      var lobbyUser = getLobbyUser(user);
      lobbyUser.foundSets++;

      $scope.$apply();
    });

    var completeCleanup = $rootScope.$on('user complete', function(event, user, score) {
      var lobbyUser = getLobbyUser(user);
      lobbyUser.foundSets = 0;
      lobbyUser.score = score;

      checkEveryoneFinished();

      $scope.$apply();
    });

    var gameOverCleanup = $rootScope.$on('game over', function() {
      if ($scope.heroReady) {
        console.log('on game over, calling showResults = true, istarted = false');
        $scope.showResults = true;
        $scope.isStarted = false;
        $scope.$apply();
      }
      else {
        console.log('on game over, calling replayMulti');
        $scope.replayMulti();
      }
    });


    function checkEveryoneFinished() {
      var numComplete = $scope.lobbyUsers.filter(function(user) {
        return user.score;
      }).length;

      if (numComplete === $scope.lobbyUsers.length) {
        gameOver();
      }
    }

    function getLobbyUser(user) {
      var userIndex = $scope.lobbyUsers.map(function(u) {
        return u.socketid;
      }).indexOf(user.socketid);

      return $scope.lobbyUsers[userIndex];
    }

    function gameOver() {
      $interval.cancel($scope.timer3);
      $scope.showResults = true;
      $scope.isStarted = false;

      multi.gameOver();
    }

    function startPuzzle() {
      if ($scope.heroReady) {
        $interval.cancel($scope.timer20);
        $scope.readyTimerValue = null;
        $scope.goTimer = 3;
        $scope.timer3 = $interval(updateGoTime, 1000);
        Math.seedrandom($scope.seed);
        $scope.gogogo = true;

        // Remove un-ready users
        $scope.lobbyUsers = $scope.lobbyUsers.filter(function(user) {
          return user.ready;
        });

      } else {
        // They weren't ready in time
        $scope.inProgress = true;
      }
    }


    $scope.$on('$destroy', function() {
      multCleanup();
      joinCleanup();
      leaveCleanup();
      startCleanup();
      partyCleanup();
      foundCleanup();
      completeCleanup();
      gameOverCleanup();
      $interval.cancel($scope.timer20);
      $interval.cancel($scope.timer3);
    });


  }
]);
