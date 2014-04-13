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
        

        if(tab === 'fastest'){self.fastestGames(getFastest());}
        if(tab === 'average'){self.averageGames(getAverage());}
        if(tab === 'last30Days'){self.last30Days(getLast30DayAverage());}                   
    };
    
    setgame.viewModel.currentTab.subscribe(function(tabValue){
        if(tabValue === 'leaderboard') {
            self.getAllGames();
        }
    });

    self.getAllGames = function () {
        
        $('#leaderboard-container').hide();
        $(".meter > span").width(0);
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
             url: "/api/GetAllGames",
             dataType: 'json',
             success: function(games){
                $(".meter > span").animate({
                    width: '100%'
                }, 100, function(){
                    $(".meter").fadeOut(function(){
                        $('#leaderboard-container').fadeIn(function(){
                            setgame.viewModel.allGames(games);
                            self.todaysGames(getTodays());
                            ninja();
                        });
                    });
                });
            }
         });
    };

    function getTodays() {
        
        var array = setgame.viewModel.allGames().filter(function (game) {
            return game.Seed === setgame.viewModel.seed();
        }).sort(function (a, b) {
            return a.Score - b.Score;
        });

        return formatGames(array);
    }

    function getFastest() {
        var array = setgame.viewModel.allGames().sort(function (a, b) {
            return a.Score - b.Score
        });

        return formatGames(array);
    }

    function getLast30DayAverage() {

        var dictionary = [];
        var averages = [];

        var games = setgame.viewModel.allGames().filter(function (game) { 
            return new Date(game.DatePlayed) > new Date(new Date() - 2592000000);
        });

        $.each(games, function (i, game) {
            dictionary[game.UserName] = dictionary[game.UserName] == null
                ? game.Score
                : dictionary[game.UserName] + "," + game.Score;
        });

        for (var i in dictionary) {
            if (dictionary.hasOwnProperty(i)) {
                var times = dictionary[i].toString().split(',');
                var username = i;

                var sum = 0.0;
                $.each(times, function (j, time) {
                    sum += parseFloat(time);
                });

                var average = sum / times.length;


                averages.push({
                    UserName: username,
                    Score: average,
                    GamesPlayed: times.length
                });
            }
        } // End for loop

        averages.sort(function (a, b) {
            return parseFloat(a.Score) - parseFloat(b.Score);
        });

        return formatGames(averages);
    }

    function getAverage() {
        var dictionary = [];
        var averages = [];

        $.each(setgame.viewModel.allGames(), function (i, game) {
            dictionary[game.UserName] = dictionary[game.UserName] == null
                ? game.Score
                : dictionary[game.UserName] + "," + game.Score;
        });

        for (var i in dictionary) {
            if (dictionary.hasOwnProperty(i)) {
                var times = dictionary[i].toString().split(',');
                var username = i;

                var sum = 0.0;
                $.each(times, function (j, time) {
                    sum += parseFloat(time);
                });

                var average = sum / times.length;


                averages.push({
                    UserName: username,
                    Score: average,
                    GamesPlayed: times.length
                });
            }
        } // End for loop

        averages.sort(function (a, b) {
            return parseFloat(a.Score) - parseFloat(b.Score);
        });

        return formatGames(averages);
    }

    function formatGames(games) {
        var formattedGames = [];
        $.each(games, function (i, game) {

            formattedGames.push({
                UserName: game.UserName,
                Score: game.Score != null ? formatScore(game.Score) : null,
                DatePlayed: game.DatePlayed != null ? formatDate(game.DatePlayed) : null,
                GamesPlayed: game.GamesPlayed != null ? game.GamesPlayed : null
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

    function ninja() {
        $('.ninja-row').hover(
            function () {
                $(this).children('.ninja-col').animate({ color: '#333333' }, 200);
            },
            function () {
                $(this).children('.ninja-col').animate({ color: 'transparent' }, 200);
            });
    }

    return self;

}());