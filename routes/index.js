
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.ejs', {user: req.user});
};