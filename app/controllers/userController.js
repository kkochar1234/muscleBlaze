var userService = require('../services/userService');

exports.getRecentOrdersForUser = function(req, res) {

  function cb(err, result) {
    if(result){
      result.cancelReasons = require('../constants/orderCancelReasons')
    }
    return res.cfaRender('account/accountOrderHistory',err, {recentOrders : result},req,res);

  }

  userService.getRecentOrdersForUser(req, cb);

}



exports.cancelOrder = function(req, res) {

  function cb(err, result) {

    return res.cfaRender(null,err, result,req,res);
  }

  userService.cancelOrder(req, cb);

}