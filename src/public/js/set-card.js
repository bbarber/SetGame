"use strict";

setgame.pieceColor = {
    red: { value: 0, name: "Red" },
    purple: { value: 1, name: "Purple" },
    green: { value: 2, name: "Green" }
};

setgame.pieceType = {
    squiggle: { value: 0, name: "Squiggle" },
    triangle: { value: 1, name: "Triangle" },
    circle: { value: 2, name: "Circle" }
};

setgame.pieceShade = {
    filled: { value: 0, name: "Filled" },
    striped: { value: 1, name: "Striped" },
    empty: { value: 2, name: "Empty" }
};

setgame.pieceColors = [setgame.pieceColor.red, setgame.pieceColor.green, setgame.pieceColor.purple];
setgame.pieceTypes = [setgame.pieceType.squiggle, setgame.pieceType.triangle, setgame.pieceType.circle];
setgame.pieceShades = [setgame.pieceShade.filled, setgame.pieceShade.empty, setgame.pieceShade.striped];

setgame.piece = function (pieceColor, pieceType, pieceShade) {
    var self = this;
    self.pieceColor = pieceColor;
    self.pieceType = pieceType;
    self.pieceShade = pieceShade;
};

setgame.card = function (piece, numPieces) {
    var self = this;
    self.piece = piece;
    self.numPieces = numPieces;

    // now used for css sprite
    self.fileName = function() {
        return (self.numPieces).toString() +
        (self.piece.pieceColor.value + 1).toString() +
        (self.piece.pieceType.value + 1).toString() +        
        (self.piece.pieceShade.value + 1).toString();
    }
    
    self.spriteClass = function() {
        return "card-" + self.fileName();
    };

    
        
    self.isSelected = ko.observable(false);

    self.toggleSelection = function (arg, event) {
        self.isSelected(!self.isSelected());
        $(event.currentTarget).toggleClass('selected');
        
        if (self.isSelected()) {
            setgame.viewModel.selections.push(self);
        }
        else {
            setgame.viewModel.selections.remove(self);
        }
        
        if (setgame.viewModel.selections().length === 3) {
            setgame.game.checkIfValidSet(setgame.viewModel.selections());
        }
    };    
    
};

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};



