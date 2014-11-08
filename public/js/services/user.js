'use strict';

setgame.factory('user', function() {

  var user = {};

  localStorage['hero'] = localStorage['hero'] || hero;

  user.isLoggedIn = !!localStorage['hero']
  user.currentUser = localStorage['hero'];

  return user;
});
