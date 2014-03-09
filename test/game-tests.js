var assert = require('assert')
  , test = require('./test-base');


describe('game', function(){

    beforeEach(function(){  
        setgame = {};
        alert = function(){ /* shh */};
        
        test.load(['game']);
    
        setgame.engine = {};
        setgame.game.clearSelection = function(){};
        setgame.viewModel = {
            foundSets: ko.observable([]), 
            board: ko.observable([])
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

    describe('checkIfValidSet', function() {
        it('should call game.isUnique if it is valid', function(){
            
            // Arrange
            var calledIsUnique = false;
            setgame.game.isUnique = function() {
              calledIsUnique = true;  
            };
            
            setgame.engine.isValidSet = function(){
                return true;
            };
            
            // Act
            setgame.game.checkIfValidSet([]);
            
            // Assert
            assert(calledIsUnique);
        })
    })
      
    describe('isUnique for first set found', function() {
        it('should return true', function(){
            // Arrange
            var legitSet = JSON.parse('[{"piece":{"pieceColor":{"value":0,"name":"Red"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":2,"fileName":"2122.gif"},{"piece":{"pieceColor":{"value":2,"name":"Green"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":1,"fileName":"1322.gif"},{"piece":{"pieceColor":{"value":1,"name":"Purple"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":3,"fileName":"3222.gif"}]');
            legitSet[0].fileName = ko.observable('2222.png');
            legitSet[1].fileName = ko.observable('1322.png');
            legitSet[2].fileName = ko.observable('3122.png');
            $ = {map: test.map};
            
            // Act
            var isUnique = setgame.game.isUnique(legitSet);
            
            // Assert
            assert(isUnique);
        })
    })
    
    describe('isUnique for duplicate set found', function() {
        it('should return false', function(){
            // Arrange
            var legitSet = JSON.parse('[{"piece":{"pieceColor":{"value":0,"name":"Red"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":2,"fileName":"2122.gif"},{"piece":{"pieceColor":{"value":2,"name":"Green"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":1,"fileName":"1322.gif"},{"piece":{"pieceColor":{"value":1,"name":"Purple"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":3,"fileName":"3222.gif"}]');
            legitSet[0].fileName = ko.observable('2222.png');
            legitSet[1].fileName = ko.observable('1322.png');
            legitSet[2].fileName = ko.observable('3122.png');
            setgame.viewModel.foundSets([legitSet]);
            $ = {map: test.map};
            
            // Act
            var isUnique = setgame.game.isUnique(legitSet);
            
            // Assert
            assert(!isUnique);
        })
    })
    
    describe('isUnique for duplicate (permutation) set found', function() {
        it('should return false', function(){
            // Arrange
            var legitSet = JSON.parse('[{"piece":{"pieceColor":{"value":0,"name":"Red"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":2,"fileName":"2122.gif"},{"piece":{"pieceColor":{"value":2,"name":"Green"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":1,"fileName":"1322.gif"},{"piece":{"pieceColor":{"value":1,"name":"Purple"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":3,"fileName":"3222.gif"}]');
            legitSet[0].fileName = ko.observable('2222.png');
            legitSet[1].fileName = ko.observable('1322.png');
            legitSet[2].fileName = ko.observable('3122.png');
            
            var permutationSet = JSON.parse('[{"piece":{"pieceColor":{"value":2,"name":"Green"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":1,"fileName":"1322.gif"},{"piece":{"pieceColor":{"value":0,"name":"Red"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":2,"fileName":"2122.gif"},{"piece":{"pieceColor":{"value":1,"name":"Purple"},"pieceType":{"value":1,"name":"Triangle"},"pieceShade":{"value":1,"name":"Striped"}},"numPieces":3,"fileName":"3222.gif"}]');
            permutationSet[0].fileName = ko.observable('1322.png');
            permutationSet[1].fileName = ko.observable('2222.png');
            permutationSet[2].fileName = ko.observable('3122.png');
            
            setgame.viewModel.foundSets([legitSet]);
            $ = {map: test.map};
            
            // Act
            var isUnique = setgame.game.isUnique(permutationSet);
            
            // Assert
            assert(!isUnique);
        })
    })
    

            
})


