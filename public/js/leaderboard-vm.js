setgame.viewModel.LeaderboardVM = (function () {
    var self = {};

    self.todaysGames = ko.observableArray();
    self.fastestGames = ko.observableArray();
    self.averageGames = ko.observableArray();
    self.last30Days = ko.observableArray();

    self.leaderBoardTab = ko.observable('today');
    self.leaderNav = function (tab) {
        $(".leader-nav").removeClass('active');
        $('#leader-' + tab).parent().addClass('active');
        self.leaderBoardTab(tab);        
        
            
    };
    
    setgame.viewModel.currentTab.subscribe(function(tabValue){
        if(tabValue === 'leaderboard') {
            self.getAllGames();
        }
    });

    self.getAllGames = function () {
        
        $('#leaderboard-container').hide();
        $(".meter > span").width('0%');
        $(".meter > span").height('5px');
        $('.meter').show();
        
        $.ajax({
             xhr: function(){
                var xhr = new window.XMLHttpRequest();
                //Download progress
                xhr.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        var widthPercent = Math.ceil(percentComplete * 100) + '%';
                        $(".meter > span").animate({
                            width: widthPercent
                        }, 100);
                 }
               }, false);
               return xhr;
             },
             type: 'GET',
             url: "/api/GetLeaderboard/" + setgame.game.getToday(),
             dataType: 'json',
             success: function(games){
                $(".meter > span").animate({
                    width: '100%',
                    height: 0
                }, 300, function(){
                    $('#leaderboard-container').fadeIn(function(){
                        setgame.viewModel.allGames(games);
                        self.todaysGames(formatGames(games.Today));
                        self.fastestGames(formatGames(games.Fastest));
                        self.averageGames(formatGames(games.Average));
                        self.last30Days(formatGames(games.MonthAverage));
                    });
                });
            }
         });
    };

    
    function formatGames(games) {
        var formattedGames = [];
        $.each(games, function (i, game) {

            formattedGames.push({
                UserName: game.UserName,
                Score: game.Score != null ? formatScore(game.Score) : null,
                DatePlayed: game.DatePlayed != null ? formatDate(game.DatePlayed) : null,
                GamesPlayed: game.GamesPlayed != null ? game.GamesPlayed : null,
                Fastest: game.Fastest != null ? formatScore(game.Fastest) : null,
                Average: game.Average != null ? formatScore(game.Average) : null,
            });
        });

        return formattedGames;
    }

    function formatDate(date) {
        return prettyDate(new Date(date).toISOString());
    }

    function formatScore(score) {

        var result = '';

        if (Math.floor(score / 60) > 0)
            result += (Math.floor(score / 60) + 'm')
        if (Math.floor(score / 60) > 0 && (score % 60) > 0)
            result += ' '
        if ((score % 60) > 0)
            result += (Math.floor(score % 60) + 's')

        return result;
    }

    return self;

}());