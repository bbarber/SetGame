'use strict';

setgame.factory('user', function() {

  localStorage['hero'] = localStorage['hero'] || hero;
  var isLoggedIn = !!localStorage['hero'];

  return {
    isLoggedIn: isLoggedIn
  };
});
