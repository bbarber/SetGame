'use strict';

setgame.factory('game', ['common', 'engine', function(common, engine) {

    return {
        start: start,
        isPractice: isPractice || false
    };

    var isPractice = false;

    function start() {
        isPractice = common.isCurrentPath('/practice');

        engine.createDeck();
    }

}]);
