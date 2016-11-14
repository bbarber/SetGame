var seed = require('seed-random'),
    request = require('request');

module.exports.set = function (app, games, http, secrets) {

    app.get('/api/GetAllGames', function (req, res) {
        games.find({}).toArray(function (err, doc) {
            res.send(doc);
        });
    });

    app.get('/api/Completed/:username/:score/:seed', function (req, res) {

        var game = {
            Seed: req.params.seed,
            UserName: req.params.username
        };

        games.find(game).toArray(function (err, doc) {

            // Check for duplicates
            if (doc.length === 0) {

                game.DatePlayed = new Date();
                game.Score = req.params.score;               
                
                games.insert(game, function (err, doc) {
                    
                    // Slackbot message *after* we insert the record
                    var params = '?token=' + secrets.slack.token + '&channel=%23' + secrets.slack.channel;
                    var options = {
                        url: 'https://dontpaniclabs.slack.com/services/hooks/slackbot' + params,
                        body: '*SetGame*  `' + game.UserName + '` - `' + game.Score + 's`'
                    };                
                    request.post(options);
                    
                    res.send(doc);
                });
            }
            else {
                console.log('duplicate game, not saving...');
                res.send('duplicate game');
            }
        });
    });

    app.get('/api/GetLeaderboard/:seed', function (req, res) {
        games.find({}).toArray(function (err, doc) {


            var seed = req.params.seed;
            var games = doc.sort(function (a, b) {
                return parseFloat(a.Score) - parseFloat(b.Score);
            });

            var todays = games.filter(function (game) {
                return game.Seed === seed;
            }).map(gameFormat);

            var fastest = games.slice(0, 200).map(gameFormat);


            var userGames = {};
            var lastMonthGames = {};

            for (var i = 0; i < games.length; i++) {

                var msPerDay = 24 * 60 * 60 * 1000;
                var diffDays = (new Date() - new Date(games[i].DatePlayed)) / msPerDay

                if (!(games[i].UserName in userGames))
                    userGames[games[i].UserName] = [games[i]];
                else
                    userGames[games[i].UserName].push(games[i]);


                if (diffDays <= 30) {
                    if (!(games[i].UserName in lastMonthGames))
                        lastMonthGames[games[i].UserName] = [games[i]];
                    else
                        lastMonthGames[games[i].UserName].push(games[i]);
                }
            }


            var averages = getAverage(userGames);
            var monthAverages = getAverage(lastMonthGames);


            res.send({
                Today: todays,
                Fastest: fastest,
                Average: averages,
                MonthAverage: monthAverages
            });
        })
    });


    function getAverage(userGames) {
        var averages = [];
        for (var name in userGames) {
            var len = userGames[name].length;


            var sum = 0;
            for (var j = 0; j < userGames[name].length; j++) {
                sum += parseFloat(userGames[name][j].Score);
            }


            var avg = sum / len;

            var quickest = parseFloat(userGames[name].sort(function (a, b) {
                return parseFloat(a.Score) - parseFloat(b.Score);
            })[0].Score);
            
            var medianIndex = Math.floor(userGames[name].length / 2);
            var median = userGames[name].sort(function (a, b) {
                return parseFloat(a.Score) - parseFloat(b.Score);
            })[medianIndex].Score;

            averages.push({
                UserName: name,
                Fastest: quickest,
                Average: avg,
                Median: median,
                GamesPlayed: len
            });
        }

        return averages.sort(function (a, b) {
            return a.Average - b.Average;
        });
    }

    function gameFormat(game) {
        return {
            UserName: game.UserName,
            Score: game.Score,
            DatePlayed: game.DatePlayed,
            Seed: game.Seed
        };
    }
};
