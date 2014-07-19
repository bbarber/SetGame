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
            }).slice(0, 200).map(gameFormat);
            

            var userGames = {};
            var lastMonthGames = {};
            
            for(var i = 0; i < doc.length; i++) {
                
                var msPerDay = 24 * 60 * 60 * 1000;
                var diffDays = (new Date() - new Date(doc[i].DatePlayed)) / msPerDay

                if(!(doc[i].UserName in userGames))
                    userGames[doc[i].UserName] = [doc[i]];
                else
                    userGames[doc[i].UserName].push(doc[i]);
                
                
                if(diffDays <= 30) {
                   if(!(doc[i].UserName in lastMonthGames))
                        lastMonthGames[doc[i].UserName] = [doc[i]];
                    else
                        lastMonthGames[doc[i].UserName].push(doc[i]);
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
    
    
    function getAverage(userGames) {
        var averages = [];
        for(var name in userGames) {
                var len = userGames[name].length;               
                
                
                var sum = 0;
                for(var j = 0; j < userGames[name].length; j++){
                    sum += parseFloat(userGames[name][j].Score);
                }
               
                
                var avg = sum / len;
                
                var quickest = parseFloat(userGames[name].sort(function(a, b){
                   return parseFloat(a.Score) - parseFloat(b.Score); 
                })[0].Score);
                

                averages.push({
                    UserName: name, 
                    Fastest: quickest,
                    Average: avg, 
                    GamesPlayed: len
                });
            }
           
        return averages;
    }
    
    function getDailySeed(time) {
        seed(time, {global: true});

        var r1 = Math.random().toFixed(10).substr(2);
        var r2 = Math.random().toFixed(10).substr(2);
        var r3 = Math.random().toFixed(10).substr(2);
        var r4 = Math.random().toFixed(10).substr(2);
        [].map(function(){return {}})
        return r1 + r2 + r3 + r4;
    }
    
    function gameFormat(game){
        return {
                UserName: game.UserName,
                Score: game.Score,
                DatePlayed: game.DatePlayed
        };        
    }
    
};