'use strict';

describe('deck-service', function() {
    beforeEach(angular.mock.module('setgame'));


    describe('module', function() {
        it('should exist', inject(function(deck) {
            should.exist(deck);
        }));
    });


    describe('getDeck', function() {
        it('should have 81 cards', inject(function(deck){
            var deck = deck.getDeck();
            deck.should.have.length(81);
        }));

        it('should only create deck once', inject(function(deck){
            var deck1 = deck.getDeck();
            var deck2 = deck.getDeck();

            // They should be the same objects in memory
            [].should.not.equal([]);
            deck1.should.equal(deck2);
        }));

        it('should have 27 of each attribute cards', inject(function(deck, card){
            var deck = deck.getDeck();

            var red    = deck.filter(function(c){return c.color === card.color.red});
            var purple = deck.filter(function(c){return c.color === card.color.purple});
            var green  = deck.filter(function(c){return c.color === card.color.green});

            var solid    = deck.filter(function(c){return c.shape === card.shape.solid});
            var striped  = deck.filter(function(c){return c.shape === card.shape.striped});
            var outlined = deck.filter(function(c){return c.shape === card.shape.outlined});

            var oval     = deck.filter(function(c){return c.fill === card.fill.oval});
            var squiggle = deck.filter(function(c){return c.fill === card.fill.squiggle});
            var diamond  = deck.filter(function(c){return c.fill === card.fill.diamond});

            var one   = deck.filter(function(c){return c.number === card.number.one});
            var two   = deck.filter(function(c){return c.number === card.number.two});
            var three = deck.filter(function(c){return c.number === card.number.three});

            red.should.have.length(27);
            purple.should.have.length(27);
            green.should.have.length(27);

            solid.should.have.length(27);
            striped.should.have.length(27);
            outlined.should.have.length(27);

            oval.should.have.length(27);
            squiggle.should.have.length(27);
            diamond.should.have.length(27);

            one.should.have.length(27);
            two.should.have.length(27);
            three.should.have.length(27);

        }));
    });

});
