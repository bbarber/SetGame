
var setgame = {};

setgame.viewModel = (function () {

    var viewModel = {};
   
    viewModel.currentTab = ko.observable('home');
    viewModel.gameState = ko.observable('stopped');
    viewModel.board = ko.observableArray();
    viewModel.selections = ko.observableArray();
    viewModel.foundSets = ko.observableArray();
    viewModel.startTime = ko.observable();
    viewModel.score = ko.observable();
    viewModel.login = ko.observable(false);
    viewModel.seed = ko.observable();
    viewModel.wasPractice = ko.observable(false);
    viewModel.allGames = ko.observableArray();
    viewModel.LeaderboardVM = {};

    return viewModel;
}());


$(function () {
    setgame.game.getTodaysSeed(function(){        
        // Showtime!    
        ko.applyBindings(setgame.viewModel);
        $('.hidden').removeClass('hidden');      
    });
});

