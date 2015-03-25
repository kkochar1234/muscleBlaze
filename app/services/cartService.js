var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    _ = require('underscore'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    securityUtil = require("../utils/securityUtils"),
    async = require('async');

exports.addToCartService = function (req, callback) {

  var options = {
    url: linkManager.getApiUrl(uris.CART_ADD.url, null),
    body: {},
    method: 'POST'
  },
  params = {};

  params[requestConstants.QUANTITY_FOR_CART] = req.body.quantity ? req.body.quantity : 1;
  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.VARIANT_ID_FOR_CART] = req.body.storeVariantId ? req.body.storeVariantId : 0;
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  params[requestConstants.VENDOR_ID] = req.body.vendorId ? req.body.vendorId : 1


  options.body = params


  //call to api to add variant to cart
  apiUtils.httpRequest(options, callback)
}

exports.getCartData = function(req, callback) {

    //async call --> one call for cart data and other for reward points info
    async.parallel({
          cartData : function(cb) {
            getCartData(req, cb);
          },
          rpInfo : function(cb) {
            getRewardPointsInfo(req, cb);
          }
        },
        //results will contain to 2 objects --> cartData & rpInfo
        function (err, results) {
          if ( err ){
            callback(err, null);

          } else {
            //parse api response to find pricing and variant details. data will be in results-->cartPricing
            var cartData = results.cartData[responseConstants.RESULTS];
            var cartPricing = cartData[responseConstants.CART_PRICING];
            if (cartPricing) {
              var cartVariants = cartPricing[responseConstants.CART_VARIANTS]
              cartVariants.forEach(function (data) {
                data.url = linkManager.getProductPageUrl(data.navKey, data.urlFragment);
              });
            }
            //adding available rewards point to cart data

            if (cartPricing) {
              cartPricing.tot_redeem_pts = results.rpInfo.results.tot_redeem_pts;
              ;
            }
            callback(null, cartData);
          }
      });

}

exports.updateCart = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.QUANTITY_FOR_CART] = req.body.qty ? req.body.qty : 1
  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.VARIANT_ID_FOR_CART] = req.body.variantId ? req.body.variantId : 0
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.VENDOR_ID] = req.body.vendorId ? req.body.vendorId : 1

  options = {
    body : {},
    method : "POST",
    url : linkManager.getApiUrl(uris.CART_UPDATE.url, null)
  }

  options.body = params;
  apiUtils.httpRequest(options, callback)

}

exports.removeVariantFromCart = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.VARIANTS_TO_REMOVE] = req.body.storeVariantsToRemove;
  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    body : {},
    method : "POST",
    url : linkManager.getApiUrl(uris.CART_VARIANT_REMOVE.url, null)
  }

  options.body = params;
  apiUtils.httpRequest(options, callback)

}

exports.applyCoupon = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.COUPON_CODE] = req.params.couponCode;

  options = {
    url : linkManager.getApiUrl(uris.COUPON_APPLY.url, params)
  }

  apiUtils.httpRequest(options, callback)

}

exports.applyOffer = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.OFFER_ID] = req.params.offerId;

  options = {
    url : linkManager.getApiUrl(uris.OFFER_APPLY.url, params)
  }

  apiUtils.httpRequest(options, callback)

}

exports.removeOffer = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url : linkManager.getApiUrl(uris.OFFER_REMOVE.url, params)
  }

  apiUtils.httpRequest(options, callback)

}

exports.redeemRewardPoints = function(req, callback) {

  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.REWARD_POINTS] = req.params.rewardPoints ? req.params.rewardPoints : 0 ;

  options = {
    url : linkManager.getApiUrl(uris.REWARD_POINTS_REDEEM.url, params)
  }

  apiUtils.httpRequest(options, callback)

}

function getCartData(req, cb) {

  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url : linkManager.getApiUrl(uris.CART_DATA.url, params)
  }

  //call to api to get user cart data
  apiUtils.httpRequest(options,cb)

}

function getRewardPointsInfo(req, cb) {
  var params = {},
      options = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url : linkManager.getApiUrl(uris.REWARD_POINTS_INFO.url, params)
  }

  //call to api to get user cart data
  apiUtils.httpRequest(options,cb)
}