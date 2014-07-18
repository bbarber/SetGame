var seed = require('seed-random');

module.exports.set = function(app, games) {
        
    app.get('/api/GetDailySeed/:time', function(req,res) {        
        var seed = getDailySeed(req.params.time);
        res.send(seed);
    });
    
    
    app.get('/api/GetAllGames', function(req, res){
        games.find({}).toArray(function(err, doc){            
            res.send(doc);
        });
    });
    
    app.get('/api/GetLeaderboard/:time', function(req, res) {
        games.find({}).toArray(function(err, doc){
            var seed = getDailySeed(req.params.time);
            
            
            
            
            var todays = doc.filter(function(game){
                return game.Seed === seed;
            }).map(gameFormat);
            
            
            var fastest = doc.sort(function(a, b){
                return parseFloat(a.Score) - parseFloat(b.Score);
            }).slice(0, 200).map();
            
            
            var userGames = {};
            for(var i = 0; i < res.length: i++) {
                
                if(!(res[i].UserName in userGames))
                    userGames[res[i].UserName] = [res[i]];
                else
                    userGames[res[i].UserName].push(res[i]);
            }
            
            var averages = [];
            for(var name in userGames) {
                var len = userGames[name].length;
                var sum = userGames[name].reduce(function(a, b){return a + b;});
                var avg = sum / len;
                
                var quickest = userGames[name].sort(function(a, b){
                   return parseFloat(a.Score) - parseFloat(b.Score); 
                })[0];
                
                averages.push({
                    UserName: name, 
                    Fastest: quickest,
                    Average: avg, 
                    GamesPlayed: len
                });
            }
        })
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
    
    function getDailySeed(time) {
        seed(time, {global: true});

        var r1 = Math.random().toFixed(10).substr(2);
        var r2 = Math.random().toFixed(10).substr(2);
        var r3 = Math.random().toFixed(10).substr(2);
        var r4 = Math.random().toFixed(10).substr(2);
        
        return r1 + r2 + r3 + r4;
    }
    
    function gameFormat(){
        return function(){
            UserName: game.UserName,
            Score: game.Score,
            DatePlayed: game.DatePlayed
        };
    }
    
};