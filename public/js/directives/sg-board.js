'use strict';

setgame.directive('sgBoard', [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'html/directives/sg-board.html',
      replace: true
    };
  }
]);
