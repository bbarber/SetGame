'use strict';

setgame.factory('GameApi', ['$resource', function ($resource) {

  // Caclulate offset milliseconds, so we can use local time
  var offset = new Date().getTimezoneOffset() * 1000 * 60;
  var today = Math.floor((Date.now() - offset) / 1000 / 60 / 60 / 24);

  return $resource('', {}, {
    getAllGames: { url: '/api/GetAllGames', isArray: true, },
    saveScore: { url: '/api/Completed/:username/:score/:seed', isArray: true }
  });
}]);
