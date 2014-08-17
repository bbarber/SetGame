'use strict';

describe('engine-service', function() {
    beforeEach(angular.mock.module('setgame'));

    describe('should exist', function() {
        it('should return full deck', inject(function(engine) {
            should.exist(engine);
        }));
    });

});
