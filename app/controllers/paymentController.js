var paymentService = require('../services/paymentService')

exports.preparePaymentForCart = function(req, res) {

  function cb(err, paymentData) {

    if(err) {
      return res.Render('payment/selectPaymentMode',null, {error:err.msg},req,res);
    }

    return res.Render('payment/selectPaymentMode',err, paymentData,req,res);

  }

  paymentService.preparePaymentForCart(req, cb);

}

exports.makePayment = function(req, res) {

  function cb(err, data) {

    return res.Render('order/orderStatus',err, data,req,res);

  }
  paymentService.makePayment(req, cb);
}