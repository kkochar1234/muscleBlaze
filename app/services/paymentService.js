var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    appConstants = require('../constants/appConstants'),
    _ = require('underscore'),
    async = require('async'),
    securityUtil = require("../utils/securityUtils");

exports.preparePaymentForCart = function (req, callback) {

  var error = {},
      response = {},
      paramsForUrl = {},
      options,
      amount,
      cartPricing,
      msg = {};

  /**
   * callback for parsing prepare payment response to find ship-ability and cod availability
   * @param err
   * @param resp
   */
  function parsePaymentResponse(err, resp) {
    if (err) {
      callback(err, null);
    } else {
      response = resp[responseConstants.RESULTS];
      if (!response.exception) {
        //if shippable and cod allowed, call to api to get payment modes
        if (response.is_shippable && response.cod_allowed) {
          cartPricing = response[responseConstants.ORDER_PRICING];
          amount = cartPricing[responseConstants.TOTAL_PAYABLE];

          //async call --> one call for payment mode and other for address details
          async.parallel({
                paymentMode : function(cb) {
                  getPaymentModes(req, amount, cb);
                },
                address : function(cb) {
                  getAddressDetails(req, cb);
                }
              },
              //results will contain to 2 objects --> paymentMode & address
              function (err, results) {
                //adding cart pricing info to result --> This will be used to show pricing info on payment mode page
                results.cartPricing = cartPricing;
                callback(err, results);
              });


        } else {
          //handling cod not allowed/non shippable cases --> sending error message to customer
          if (response.ship_disable_msg) {
            callback({msg:response.ship_disable_msg}, null);
          } else {
            callback({msg:response.cod_disable_msg}, null);
          }
        }
      } else {
        callback({msg:response.msgs[0]}, null);
      }
    }
  }

  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  paramsForUrl[requestConstants.USER_ID] = securityUtil.getUserId(req);
  paramsForUrl[requestConstants.ADDRESS_ID] = req.query.selectedAddressId;
  paramsForUrl[requestConstants.PAYMENT_TYPE] = appConstants.PAYMENT_CONSTANTS.COD_PAYMENT_MODE_ID;

  options = {
    url: linkManager.getApiUrl(uris.PAYMENT_PREPARE.url, paramsForUrl)
  };

  //call to api to check ship-ability and cod availability
  apiUtils.httpRequest(options, parsePaymentResponse);

}

exports.makePayment = function (req, callback) {

  var paramsForUrl = {},
      paramsForBody = {},
      options = {};

  function parsePaymentResponse(err, resp) {
    if(err) {
      callback(err, null);
    } else {
      var variantsOrdered = resp[responseConstants.RESULTS][responseConstants.ORDER_PLACED_DETAILS][responseConstants.ORDERED_VARIANTS];
      variantsOrdered.forEach(function(variant) {
        variant.url =  linkManager.getProductPageUrl(variant[responseConstants.NAV_KEY], variant[responseConstants.URL_FRAGMENT]);
      });
      callback(null, resp);
    }
  }

  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  paramsForUrl[requestConstants.USER_ID] = securityUtil.getUserId(req);
  paramsForUrl[requestConstants.NATIVE_PAY_MODE] = appConstants.PAYMENT_CONSTANTS.COD_PAYMENT_OPTION;

  paramsForBody[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  paramsForBody[requestConstants.USER_ID] = securityUtil.getUserId(req);
  paramsForBody[requestConstants.CONTACT_NAME] = req.body.contactName;
  paramsForBody[requestConstants.CONTACT_NO] = req.body.contactNo;
  paramsForBody[requestConstants.ADDRESS_ID_PAYMENT] = req.body.addressId;
  paramsForBody[requestConstants.EMAIL] = securityUtil.getUserEmail(req);
  paramsForBody[requestConstants.IP_ADDRESS] = req.connection.remoteAddress;
  paramsForBody[requestConstants.NATIVE_MODE_PAYMENT] = false;
  paramsForBody[requestConstants.PAYMENT_TYPE_ID] = appConstants.PAYMENT_CONSTANTS.COD_PAYMENT_MODE_ID;
  paramsForBody[requestConstants.AMOUNT] = req.body.amount;
  paramsForBody[requestConstants.PLATFORM_ID] = appConstants.PLATFORM_CONSTANTS.MOBILE;


  options = {
    url: linkManager.getApiUrl(uris.PAYMENT_ACCEPT.url, paramsForUrl),
    method: "POST",
    body: {}
  }

  options.body = paramsForBody;
  apiUtils.httpRequest(options, parsePaymentResponse)

}

var getPaymentModes = function (req, amount, callback) {
  var params = {},
      options = {};

  function parsePaymentModeResponse(err, data) {
    if(err) {
      callback(err.msg, null);
    } else {
      callback(null, data[responseConstants.RESULTS]);
    }
  }

  params[requestConstants.AMOUNT] = amount;
  params[requestConstants.NATIVE_MODE] = true;
  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url: linkManager.getApiUrl(uris.PAYMENT_MODE.url, null),
    method: "POST",
    body: {}
  }

  options.body = params;
  apiUtils.httpRequest(options, parsePaymentModeResponse);
}

var getAddressDetails = function (req, callback) {

  var paramsForUrl = {},
      addressId = req.query.selectedAddressId,
      options = {};

  function parseAddressResponse(err, data) {
    if (err) {
      callback(err.msg, null);
    } else {
      callback(null, data[responseConstants.RESULTS]);
    }
  }

  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  paramsForUrl[requestConstants.ADDRESS_ID] = addressId;

  options = {
    url: linkManager.getApiUrl(uris.ADDRESS_GET.url, paramsForUrl)
  };
  apiUtils.httpRequest(options, parseAddressResponse);
}

/*
var getUserDetails = function (req, callback) {

  var paramsForUrl = {},
      userId = securityUtil.getUserId(req);,
      options = {};

  function parseUserResponse(err, data) {
    if (err) {
      callback(err.msg, null);
    } else {
      callback(null, data[responseConstants.RESULTS]);
    }
  }

  paramsForUrl[requestConstants.USER_ID] = userId;

  options = {
    url: linkManager.getApiUrl(uris.USER_GET.url, paramsForUrl)
  };
  apiUtils.httpRequest(options, parseUserResponse);
}*/
