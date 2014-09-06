'use strict';

setgame.constant('card', {
  color: {
    red: 1,
    purple: 2,
    green: 3
  },
  shape: {
    solid: 1,
    striped: 2,
    outlined: 3
  },
  fill: {
    oval: 1,
    squiggle: 2,
    diamond: 3
  },
  number: {
    one: 1,
    two: 2,
    three: 3
  },
  toImg: function(card) {
    return card.number.toString()
         + card.color.toString()
         + card.shape.toString()
         + card.fill.toString()
         + '.png';
  },
  equals: function(card1, card2) {
    return card1.number === card2.number
        && card1.color === card2.color
        && card1.shape === card2.shape
        && card1.fill === card2.fill;
  }
});
