'use strict';

setgame.factory('deck', ['card',
  function(card) {

    var deck = [];

    return {
      getDeck: getDeck
    };

    function getDeck() {
      // Only create the deck once
      if (deck.length === 0)
        createDeck();

      return deck;
    }

    function createDeck() {
      for (var color in card.color) {
        for (var shape in card.shape) {
          for (var fill in card.fill) {
            for (var number in card.number) {
              deck.push({
                color: card.color[color],
                shape: card.shape[shape],
                fill: card.fill[fill],
                number: card.number[number]
              });
            }
          }
        }
      }
    }

  }
]);
