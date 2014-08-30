var seed = require('seed-random');

module.exports.set = function(app, games) {

    app.get('/api/GetAllGames', function(req, res){
        games.find({}).toArray(function(err, doc){
            res.send(doc);
        });
    });

    app.get('/api/Completed/:username/:score/:seed', function(req, res){

        var game = {
          Seed: req.params.seed,
          UserName: req.params.username
        };

        games.find(game).toArray(function(err, doc){

            // Check for duplicates
            if(doc.length === 0) {

                game.DatePlayed = new Date();
                game.Score = req.params.score;

                games.insert(game, function(err, doc){
                    res.send(doc);
                });
            }
            else {
                console.log('duplicate game, not saving...');
                res.send('duplicate game');
            }
        });
    });
};
