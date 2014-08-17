'use strict';

setgame.factory('engine', ['card', function(card) {

    return {
        createDeck: createDeck
    };

    var deck = [];

    function createDeck() {

        for(var color in card.color) {
            for(var shape in card.shape) {
                for(var fill in card.fill) {
                    for(var number in card.number) {
                        console.log('' + card.color[color] + card.shape[shape] + card.fill[fill] + card.number[number]);
                    }
                }
            }
        }

    }

}]);
