'use strict';

setgame.factory('engine', ['deck', 'card', function(deck, card) {

    return {
        createBoard: createBoard,
        isValidSet: isValidSet
    };

    function createBoard() {
        do {
            var board = getBoard();
            var numSets = getSets(board);
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

    function getSets(board) {
        var numSets = 0;

        for(var i = 0; i < 10; i++) {
            for(var j = 1 + i; j < 11; j++) {
                for(var k = 1 + j; k < 12; k++) {
                    if(isValidSet([board[i], board[j], board[k]]))
                        numSets++;
                }
            }
        }

        return numSets;
    }

    function isValidSet(cards) {
        for(var attr in card) {

            // Look at each attribute, and see if they're
            // all the same, or all different
            var values = [
                cards[0][attr],
                cards[1][attr],
                cards[2][attr]
            ];

            if(!hasSame(values) && !hasDifferent(values))
                return false;
        }

        // If we got here, it's a valid set
        return true;
    }

    function hasSame(values) {
        return values[0] === values[1]
            && values[0] === values[2];
    }

    function hasDifferent(values) {
        return values[0] !== values[1]
            && values[0] !== values[2]
            && values[1] !== values[2];
    }


}]);
