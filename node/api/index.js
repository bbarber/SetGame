

exports.getDailySeed = function(req,res) {
 seed(req.params.time, {global: true});
    
    var r1 = Math.random().toFixed(10).substr(2);
    var r2 = Math.random().toFixed(10).substr(2);
    var r3 = Math.random().toFixed(10).substr(2);
    var r4 = Math.random().toFixed(10).substr(2);
    
    res.send(r1 + r2 + r3 + r4);
};


exports.getAllGames = function(req, res){
    games.find({}).toArray(function(err, doc){
        res.send(doc);
    });
});

 

exports.completed = function(req, res){

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
