var cartService = require('../services/cartService')

exports.addToCart = function(req,res){

  function cb(err, addToCartResponse) {
    res.render(null,err,addToCartResponse,req,res)
  }

  cartService.addToCartService(req, cb)

}

exports.getCartData = function(req, res) {

  function cb (err, cartInfo) {

      res.render('cart/cart', err,cartInfo,req,res)
  }

  cartService.getCartData(req, cb)

}

exports.updateCart = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.updateCart(req, cb)

}

exports.removeVariantFromCart = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.removeVariantFromCart(req, cb)

}

exports.applyCoupon = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.applyCoupon(req, cb)

}

exports.applyOffer = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.applyOffer(req, cb)

}

exports.removeOffer = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.removeOffer(req, cb)

}

exports.redeemRewardPoints = function(req, res) {

  function cb (err, data) {

    res.render(null, err,data,req,res)

  }

  cartService.redeemRewardPoints(req, cb)

}