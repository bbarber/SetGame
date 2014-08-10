setgame.factory('common', ['$location', function($location) {
    return {
        isCurrentPath: isCurrentPath,
        isPractice: isPractice || false
    };

    var isPractice = false;

    function isCurrentPath(path) {
        return $location.path().toLowerCase() === path.toLowerCase();
    };

}]);
