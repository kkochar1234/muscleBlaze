var menuService = require('../services/menuService')

module.exports.home = function(req,res){



  function cb(err, resp) {
      return res.cfaRender('home',err,resp,req,res)
  }

  menuService.getMenuNodes(req, cb)

}

