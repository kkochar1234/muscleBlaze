var menuService = require("../services/menuService")

exports.renderMenu = function(req, res) {

  function cb(err, data) {

    return res.cfaRender('home',err, data,req,res);

  }

  menuService.getMenuNodes(req, cb)

}