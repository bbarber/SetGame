'use strict';

setgame.filter('makePretty', function() {
  return function(input, type) {

    if(!input)
      return '';

    if (type === 'date') {
      return prettyDate(new Date(input).toISOString());
    }

    if (type === 'score') {
      var minutes = parseInt(input / 60, 10);
      var seconds = parseInt(input % 60, 10);

      return (minutes ? minutes + 'm ' : '')
           + (seconds ? seconds + 's ' : '');
    }
  };
});
