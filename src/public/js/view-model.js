var setgame = (function () {

    var module = {};

    module.viewModel = new function () {
        var self = this;

        self.currentTab = ko.observable('home');
        self.gameState = ko.observable('stopped');
        self.board = ko.observableArray();
        self.selections = ko.observableArray();
        self.foundSets = ko.observableArray();
        self.startTime = ko.observable();

        self.score = ko.observable();
        self.login = ko.observable(false);
        self.seed = ko.observable();
        self.wasPractice = ko.observable(false);

        self.allGames = ko.observableArray();

        self.LeaderboardVM = {};
    }

    return module;
}());


$(function () {
    setgame.game.getTodaysSeed();
});

