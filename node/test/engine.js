var files = ['engine', 'set-card'];
var assert = require('assert');


var testInit = function() {
    setgame = {
        viewModel: {
            board:[]
        }
    };
    
    for(var i = 0; i < files.length; i++) {
        var path = '../public/js/' + files[i];        

        // Clear the module cache if it exists
        if(require.resolve(path)) {
            require.cache[require.resolve(path)] = null;
        }
        
        require(path);
    }    
    
    // only loads once, node will cache
    ko = require('knockout')
};


describe('engine', function() {
    describe('testme', function() {
        it('should pass', function(){            
            assert.equal('Thanks Chad!', 'Thanks Chad!');    
        })        
    })
})

describe('engine', function(){
    describe('file reference', function() {
        it('should load engine module', function(){
            testInit();
            assert(setgame.engine != null);
        })
    })
})

describe('engine', function() {
    describe('initializeBoard', function() {
        it('should create a deck with 81 cards', function() {
            
            // arrange
            testInit();
            assert.equal(setgame.engine.deck.length, 0);
            
            // act
            setgame.engine.initializeBoard();
            
            // assert
            assert.equal(setgame.engine.deck.length, 81);
        })
    })
})

describe('engine', function() {
    describe('initializeBoard', function() {
        it('should create board with 12 cards in 3x4 layout', function() {
            
            // arrange
            testInit();
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
