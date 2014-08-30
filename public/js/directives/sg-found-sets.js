'use strict';

setgame.directive('sgFoundSets', [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'html/directives/sg-found-sets.html',
      replace: true
    };
  }
]);
