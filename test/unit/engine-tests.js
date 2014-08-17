'use strict';

describe('engine-service', function() {
    beforeEach(angular.mock.module('setgame'));


    describe('module', function() {
        it('should exist', inject(function(engine) {
            should.exist(engine);
        }));
    });

});
