'use strict';

setgame.factory('game', ['common', 'engine', function(common, engine) {

    var isPractice = false;

    return {
      start: start,
      isPractice: isPractice
    };

    function start() {
      isPractice = common.isCurrentPath('/practice');

      engine.createDeck();
    }

  }
]);
