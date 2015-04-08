var homeService = require('../services/homeService');
module.exports.home = function(req,res){



  function cb(err, resp) {
      return res.Render('home',err, {productMenu: resp.productMenu, bannerDetails: resp.bannerDetails },req,res)
  }

  homeService.renderHomePage(req, cb)

}

