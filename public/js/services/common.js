setgame.factory('common', ['$location', function($location) {
    return {
        isCurrentPath: isCurrentPath,
    };

    function isCurrentPath(path) {
        return $location.path().toLowerCase() === path.toLowerCase();
    };

}]);
