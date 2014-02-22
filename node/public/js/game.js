setgame.game = (function () {
    var game = {};

    game.startDailyGame = function (user) {
        
        if (setgame.viewModel.currentTab() === 'practice') {
            game.start();
        }
        else if (user == null) {
            setgame.viewModel.login(true);
        }
        else {
            setgame.viewModel.login(false);
            game.username = user ? user.username : null;
            game.start();
        }
    }

    game.start = function () {

        var isPractice = setgame.viewModel.currentTab() === 'practice';
        Math.seedrandom(isPractice ? Date.now() : setgame.viewModel.seed());

        setgame.viewModel.gameState('loading');
        setgame.viewModel.gameState('started');
        setgame.engine.initializeBoard();
        setgame.viewModel.startTime(new Date().getTime());
    }

    game.getTodaysSeed = function (callback) {
        // Caclulate offset milliseconds, so we can use local time
        var offset = new Date().getTimezoneOffset() * 1000 * 60;
        var today = Math.floor((Date.now() - offset) / 1000 / 60 / 60 / 24);
        
        $.ajax({
            url: 'api/GetDailySeed/' + today,
            success: function (seed) {
                Math.seedrandom(seed);
                setgame.viewModel.seed(seed);
                setgame.viewModel.LeaderboardVM.getAllGames();

                callback();
            }
        });
    }

    game.checkIfValidSet = function (set) {

        if (setgame.engine.isValidSet(set[0], set[1], set[2])) {
            if (setgame.game.isUnique(set)) {
                setgame.viewModel.foundSets.push(set);
            }
            else {
                alert("Already found");
            }
        }
        else {
            alert('Not valid set');
        }


        if (setgame.viewModel.foundSets().length === 6) {
            game.winning();
        }


        game.clearSelection();
    }

    game.winning = function () {
        var score = (new Date().getTime() - setgame.viewModel.startTime()) / 1000.0;
        setgame.viewModel.score(score);
        setgame.viewModel.gameState('winning');

        var wasPractice = setgame.viewModel.currentTab() === 'practice';
        setgame.viewModel.wasPractice(wasPractice);

        setgame.viewModel.currentTab('stats');

        if (!wasPractice) {
            $.ajax({
                url: 'api/Completed/' + game.username + "/" + score + "/" + setgame.viewModel.seed(),
                dataType: 'json',
                success: function () {
			setgame.viewModel.LeaderboardVM.getAllGames()
                }
            });
        }
    }

    game.isUnique = function (set) {
        var foundSets = setgame.viewModel.foundSets();

        var fileNames = [];
        for (var i in foundSets) {
            fileNames.push($.map(foundSets[i], function (val) {
                return val.fileName;
            }).sort());
        }

        var curSetFileNames = $.map(set, function (val, i) {
            return val.fileName;
        }).sort();


        for (var i in fileNames) {
            if (fileNames[i][0] === curSetFileNames[0] &&
                fileNames[i][1] === curSetFileNames[1] &&
                fileNames[i][2] === curSetFileNames[2]) {
                return false;
            }
        }

        return true;
    }


    game.practiceMeow = function () {
        setgame.viewModel.currentTab('practice');
        setgame.viewModel.board([]);
        setgame.viewModel.foundSets([]);
        setgame.game.start();
    }

    game.clearSelection = function () {

        setgame.viewModel.selections = ko.observableArray();

        for (var i = 0; i < setgame.viewModel.board().length; i++) {
            for (var j = 0; j < setgame.viewModel.board()[i].length; j++) {
                setgame.viewModel.board()[i][j].isSelected(false);
            }
        }

    }

    return game;
}());


