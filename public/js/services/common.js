'use strict';

setgame.factory('common', ['$location',
  function($location) {

    return {
      isCurrentPath: isCurrentPath,
      isPractice: isPractice,
      isMultiPlayer: isMultiPlayer
    }

    function isCurrentPath(path) {
      return $location.path().toLowerCase() === path.toLowerCase();
    }

    function isPractice() {
      return isCurrentPath('/practice');
    }

    function isMultiPlayer() {
      return isCurrentPath('/multiplayer');
    }

  }
]);
