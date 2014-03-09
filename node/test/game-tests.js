var assert = require('assert')
  , test = require('./test-base');


describe('game', function(){
    describe('file reference', function() {
        it('should load game module', function(){
            test.init(['game']);
            assert(setgame.game != null);
        })
    })
})