'use strict';

setgame.directive('sgProgress', function() {
  return {
    restrict: 'E',
    templateUrl: 'html/directives/sg-progress.html',
    replace: true,
    controller: ['$scope',
      function($scope) {

        // On page load, hide progress bar
        $scope.percentLoaded = 0;
      }
    ]
  };
});
