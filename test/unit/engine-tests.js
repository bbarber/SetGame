'use strict';

describe('engine-service', function() {
    beforeEach(angular.mock.module('setgame'));

    describe('module', function() {
        it('should exist', inject(function(engine) {
            should.exist(engine);
        }));
    });

    describe('createBoard', function() {
        it('should contain 12 cards', inject(function(engine, deck) {
            var board = engine.createBoard();
            board.should.have.length(12);
        }));

        it('should have unique cards', inject(function(engine, deck) {
            var board = engine.createBoard();
            for(var i = 0; i < board.length - 1; i++) {
                for(var j = i + 1; j < board.length; j++) {

                    // Make sure we're not compring the same card
                    expect(i).to.not.equal(j);

                    var isSameColor  = board[i].color  === board[j].color;
                    var isSameShape  = board[i].shape  === board[j].shape;
                    var isSameFill   = board[i].fill   === board[j].fill;
                    var isSameNumber = board[i].number === board[j].number;

                    // Two differnt cards should be different
                    expect(isSameColor
                        && isSameShape
                        && isSameFill
                        && isSameNumber).to.not.be.true;
                }
            }
        }));
    });

});
