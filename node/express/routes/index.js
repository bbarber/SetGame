
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.ejs', {layout: false});
};