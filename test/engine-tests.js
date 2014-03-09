var assert = require('assert')
  , test = require('./test-base');
    

describe('engine', function(){
    
    beforeEach(function(){        
        setgame = { viewModel: { board:[] } };        
        test.load(['engine', 'set-card']);
    })
    
    
    describe('reference', function() {
        it('should load engine module', function(){
            assert(setgame.engine != null);
        })
    })
    
    describe('initializeBoard', function() {
        it('should create a deck with 81 cards', function() {
            
            // arrange
            assert.equal(setgame.engine.deck.length, 0);
            
            // act
            setgame.engine.initializeBoard();
            
            // assert
            assert.equal(setgame.engine.deck.length, 81);
        })
    })

    describe('initializeBoard', function() {
        it('should create board with 12 cards in 3x4 layout', function() {
            
            // arrange
            assert.equal(setgame.viewModel.board.length, 0);
            
            // act
            setgame.engine.initializeBoard();
            
            // assert
            assert.equal(setgame.viewModel.board.length, 3);
            assert.equal(setgame.viewModel.board[0].length, 4);
            assert.equal(setgame.viewModel.board[1].length, 4);
            assert.equal(setgame.viewModel.board[2].length, 4);
        })
    })
    
})


