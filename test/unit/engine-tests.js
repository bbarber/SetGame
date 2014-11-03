'use strict';

describe('engine-service', function() {
    beforeEach(angular.mock.module('setgame'));

    describe('module', function() {
        it('should exist', inject(function(engine) {
            should.exist(engine);
        }));
    });

    describe('createBoard', function() {
        var board = [];

        beforeEach(inject(function(engine, deck) {
            board = engine.createBoard();
        }));

        it('should contain exactly 12 cards', inject(function(engine, deck) {
            board.should.have.length(12);
        }));

        it('should have unique cards', inject(function(engine, deck) {
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

        it('should contain exactly 6 valid sets', inject(function(engine, deck) {
            var combos = [];
            var numSets = 0;

            for(var i = 0; i < 10; i++) {
                for(var j = i + 1; j < 11; j++) {
                    for(var k = j + 1; k < 12; k++) {

                        var cards = [
                            board[i],
                            board[j],
                            board[k],
                        ];

                        if(engine.isValidSet(cards))
                            numSets++;
                    }
                }
            }

            numSets.should.equal(6);
        }));
    });

    describe('isValidSet', function() {
        it('should be invalid if same card twice', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 2, shape: 2, fill: 2, number: 2 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be invalid if two same color', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 1, shape: 2, fill: 2, number: 2 },
                {color: 2, shape: 3, fill: 3, number: 3 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be invalid if two same shape', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 2, shape: 3, fill: 2, number: 2 },
                {color: 3, shape: 3, fill: 3, number: 3 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be invalid if two same fill', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 2 },
                {color: 1, shape: 2, fill: 2, number: 2 },
                {color: 1, shape: 3, fill: 2, number: 2 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be invalid if two same number', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 3, shape: 3, fill: 3, number: 3 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be invalid because all same card', inject(function(engine, card) {
            var cards = [
                {color: 2, shape: 2, fill: 2, number: 2 },
                {color: 2, shape: 2, fill: 2, number: 2 },
                {color: 2, shape: 2, fill: 2, number: 2 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(false);
        }));

        it('should be valid because all different', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 2, shape: 2, fill: 2, number: 2 },
                {color: 3, shape: 3, fill: 3, number: 3 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(true);
        }));

        it('should be valid because all same except number', inject(function(engine, card) {
            var cards = [
                {color: 1, shape: 1, fill: 1, number: 1 },
                {color: 1, shape: 1, fill: 1, number: 2 },
                {color: 1, shape: 1, fill: 1, number: 3 },
            ];

            var isValid = engine.isValidSet(cards);
            isValid.should.equal(true);
        }));

    });

});
