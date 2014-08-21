'use strict';

setgame.factory('engine', ['deck', 'card', function(deck, card) {

    return {
        createBoard: createBoard
    };

    function createBoard() {
        do {
            var board = getBoard();
            var numSets = getSets();
        } while(numSets !== 6);

        return board;
    }

    function getBoard() {
        var cards = deck.getDeck();
        var board = [];
        var indexes = [];

        do {
            var index = Math.floor(Math.random() * 81);

            // If the card is already in the board, skip
            if(indexes[index])
                continue;

            indexes[index] = true;
            board.push(cards[index]);

        } while(board.length !== 12);

        return board;
    }

    function getSets() {
        return 6;
    }

}]);
