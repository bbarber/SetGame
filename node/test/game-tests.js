var assert = require('assert')
  , test = require('./test-base');


describe('game', function(){

    beforeEach(function(){  
        setgame = {};
        alert = console.log
        
        test.load(['game']);
    
        setgame.engine = {};
        setgame.game.clearSelection = function(){};
        setgame.viewModel = {
            foundSets: function(){return []}, 
            board: ko.observable()
        };
    })    
    
    describe('file reference', function() {
        it('should load game module', function(){
            assert(setgame.game != null);
        })
    })
    
    describe('checkIfValidSet', function() {
        it('should call engine.isValidSet', function(){
            
            // Arrange
            var calledIsValidSet = false;
            setgame.engine.isValidSet = function(){
                calledIsValidSet = true;
            };
            
            // Act
            setgame.game.checkIfValidSet([]);
            
            // Assert
            assert(calledIsValidSet);
        })
    })

})


