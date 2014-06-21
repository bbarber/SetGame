var seed = require('seed-random');

module.exports.set = function(app, games) {
        
    app.get('/api/GetDailySeed/:time', function(req,res) {
        seed(req.params.time, {global: true});

        var r1 = Math.random().toFixed(10).substr(2);
        var r2 = Math.random().toFixed(10).substr(2);
        var r3 = Math.random().toFixed(10).substr(2);
        var r4 = Math.random().toFixed(10).substr(2);

        res.send(r1 + r2 + r3 + r4);
    });
    
    
    app.get('/api/GetAllGames/:max', function(req, res){
        
        var max = parseInt(req.params.max || 0, 10);
        
        games.find({}).toArray(function(err, doc){
            var sortedGames = doc.sort(function(g1, g2){
                return parseFloat(g1.Score, 10) -  parseFloat(g2.Score, 10);
            });
            
            res.send(sortedGames.slice(0, max));
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