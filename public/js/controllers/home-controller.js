'use strict';

setgame.controller('HomeController', ['$scope', 'common', 'engine', 'user', 'GameApi', 'card',
  function($scope, common, engine, user, GameApi, card) {

    $scope.isPractice = common.isPractice();

    GameApi.getDailySeed(function(seed) {
      // If practice, use current time to seed, otherwise use daily seed
      Math.seedrandom($scope.isPractice ? Date.now() : seed);
    });





    $scope.start = function() {
      console.log('starting..');

      if ($scope.isPractice || user.isLoggedIn) {

        var board = engine.createBoard();

        // Format a little easier for the UI
        $scope.board = [
          [board[0], board[1], board[2], board[3]],
          [board[4], board[5], board[6], board[7]],
          [board[8], board[9], board[10], board[11]]
        ];

        $scope.isStarted = true;
      } else {
        // If they want to play non-practice
        // they must be logged in first
        $scope.showLogins = true;
      }
    };

    $scope.toImg = function(c) {
      return card.toImg(c);
    };

    var selectedCards = [];

    $scope.toggleSelection = function(selectedCard) {
      selectedCard.isSelected = !selectedCard.isSelected;

      // Prevent adding the same card twice
      if (selectedCard.isSelected)
        selectedCards.push(selectedCard);
      else {
        var index = selectedCards.indexOf(selectedCard);
        console.log('removing ' + index);
        if (index !== -1) {
          selectedCards.splice(index, 1);
          console.log('after removing arr len ' + selectedCards.length);
        }

      }


      if (selectedCards.length === 3) {
        console.log(engine.isValidSet(selectedCards));
        if (engine.isValidSet(selectedCards)) {
          console.log('valid set, make sure unique!');
        }

        clearSelection();
      }

    };

    function clearSelection() {
      console.log('clearing selection')
      angular.forEach(selectedCards, function(c) {
        c.isSelected = false;
      });
      selectedCards = [];
    }

  }
]);
