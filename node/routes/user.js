
/*
 * GET users listing.
 */

// exports.list = function(req, res){
    
//     var collection = db.get('users');
//     collection.find({}, {}, function(e, docs){
//         res.render('index', {
//             title : docs
//         });
//     });
// };


exports.list = function(db) {
    return function(req, res) {
        var collection = db.get('users');
        var users = collection.find({}, function(err, doc) {
            res.write(JSON.stringify(err || doc));
        });
    };
};