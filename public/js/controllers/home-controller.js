'use strict';

setgame.controller('HomeController', ['$scope', '$location', '$window', '$rootScope', 'common', 'engine', 'user', 'GameApi', 'card', 'multi',
  function($scope, $location, $window, $rootScope, common, engine, user, GameApi, card, multi) {

    $scope.isPractice = common.isPractice();
    $scope.isMultiPlayer = common.isMultiPlayer();
    $scope.isMultiStarted = false;
    $scope.isStartPressed = false;

    var offSetHours = new Date().getTimezoneOffset();
    $scope.seed = parseInt((new Date().getTime() / (1000 * 60)  - offSetHours) / (60 * 24), 10);

    // If practice, use current time to seed, otherwise use daily seed
    Math.seedrandom($scope.isPractice ? Date.now() : $scope.seed);


    $scope.start = function() {

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

      if (!$scope.isPractice) {
        GameApi.saveScore({
          username: localStorage['hero'],
          score: $rootScope.score,
          seed: $scope.seed
        });
      }

      // Navigate to the stats page so they can see their score
      $location.path('/stats');
    }

    $scope.lobbyUsers = [];

    if(common.isMultiPlayer()) {
      multi.getLobby(function(lobbyUsers) {
        $scope.lobbyUsers = lobbyUsers;
        multi.joinLobby();
      });
    }

    $scope.startMulti = function() {
      if(!$scope.isMultiStarted) {
        multi.startGame();
      }
    };

    $scope.readyMulti = function() {

    };

    var multCleanup = $scope.$on('$locationChangeSuccess', function() {
      if(!common.isMultiPlayer()) {
        multi.leaveLobby();
      }
    });

    var joinCleanup = $rootScope.$on('join lobby', function(event, user) {
      $scope.lobbyUsers.push(user);
      $scope.$apply();
    });

    var leaveCleanup = $rootScope.$on('leave lobby', function(event, user) {
      var index = $scope.lobbyUsers.map(function(u) {
        return u.socketid;
      }).indexOf(user.socketid);

        $scope.lobbyUsers.splice(index, 1)[0];
        $scope.$apply();
    });

    var startCleanup = $rootScope.$on('start game', function(event, seed) {
        console.log('someone started the game: ' + seed);
        $scope.isStartPressed = true;
        $scope.$apply();
    });

    $scope.$on('$destroy', function () {
      multCleanup();
      joinCleanup();
      leaveCleanup();
      startCleanup();
    });


  }
]);
