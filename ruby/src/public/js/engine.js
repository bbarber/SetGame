setgame.engine = (function () {
    var engine = {};

    engine.deck = [];

    engine.initializeBoard = function () {

        engine.createDeck();

        while (true) {
            var _board = engine.getBoard();
            if (engine.findSets(_board) === 6)
                break;
        }

        setgame.viewModel.board.push(_board.slice(0, 4));
        setgame.viewModel.board.push(_board.slice(4, 8));
        setgame.viewModel.board.push(_board.slice(8, 12));
    }

    engine.getBoard = function () {

        var _board = [];
        while (true) {
            if (_board.length === 12)
                break;

            var rand = Math.floor(Math.random() * 81);
            if (_board.contains(engine.deck[rand]) === false) {
                _board.push(engine.deck[rand]);
            }
        }
        return _board;
    }

    engine.findSets = function (_board) {

        var combos = engine.findCombos();

        var sets = [];
        for (var i = 0; i < combos.length; i++) {
            var card1 = _board[combos[i][0]];
            var card2 = _board[combos[i][1]];
            var card3 = _board[combos[i][2]];

            sets.push([card1, card2, card3]);
        }

        var _shapes = [];
        var _shades = [];
        var _colors = [];

        var setsFound = 0;

        for (var i = 0; i < sets.length; i++) {
            var card1 = sets[i][0];
            var card2 = sets[i][1];
            var card3 = sets[i][2];

            if (engine.isValidSet(card1, card2, card3)) {
                setsFound = setsFound + 1;
            }
        }

        return setsFound;
    }

    engine.isValidSet = function (card1, card2, card3) {

        var c1 = card1.piece;
        var c2 = card2.piece;
        var c3 = card3.piece;

        if (engine.isValid(c1.pieceColor.value, c2.pieceColor.value, c3.pieceColor.value)
            && engine.isValid(c1.pieceType.value, c2.pieceType.value, c3.pieceType.value)
            && engine.isValid(c1.pieceShade.value, c2.pieceShade.value, c3.pieceShade.value)
            && engine.isValid(card1.numPieces, card2.numPieces, card3.numPieces)) {
            return true;
        }
        else {
            return false;
        }
    }

    engine.isValid = function (v1, v2, v3) {
        if (v1 === undefined || v2 === undefined || v3 === undefined) {
            return false;
        }
        else if (v1 === v2 && v1 === v3) {
            return true;
        }
        else if (v1 !== v2 && v2 !== v3 && v1 !== v3) {
            return true;
        }
        else {
            return false;
        }
    }

    engine.findCombos = function () {
        var combos = [];

        for (var i = 0; i < 10; i++) {
            for (var j = i + 1; j < 11; j++) {
                for (var k = j + 1; k < 12; k++) {
                    combos.push([i, j, k]);
                }
            }
        }

        return combos;
    }

    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    engine.createDeck = function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    for (var m = 1; m <= 3; m++) {
                        var _piece = new setgame.piece(setgame.pieceColors[i], setgame.pieceTypes[j], setgame.pieceShades[k]);
                        engine.deck.push(new setgame.card(_piece, m));
                    }
                }
            }
        }
    }

    return engine;
}());

