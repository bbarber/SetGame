'use strict';

setgame.factory('common', ['$location',
  function($location) {
    return {
      isCurrentPath: isCurrentPath,
      isPractice: isPractice
    }

    function isCurrentPath(path) {
      return $location.path().toLowerCase() === path.toLowerCase();
    }

    function isPractice() {
      return isCurrentPath('/practice');
    }

  }
]);
