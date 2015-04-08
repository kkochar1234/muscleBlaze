var productService = require("../services/productService"),
    securityUtil = require("../utils/securityUtils"),
    linkManager = require("../utils/LinkManager"),
    menuControlller = require("./menuController"),
    menuService = require("../services/menuService");

exports.renderProductPage = function (req,res) {

  function cb(err,data) {

    return res.Render('product/product',err, {productDetails : data.productDetails, productMenu: data.productMenu},req,res);
  }
  console.log("Rendering Product Page : ");
  productService.renderProductPage(req,cb);
}

exports.renderConcernPage = function (req,res) {

  function cb(err,data) {

    return res.Render('product/product',err, {productDetails : data.concernDetails, productMenu: data.productMenu},req,res);
  }
  console.log("Rendering Product Page : ");
  productService.renderConcernPage(req,cb);
}
