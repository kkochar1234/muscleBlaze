var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    securityUtil = require("../utils/securityUtils"),
    oStatus = require("../constants/orderStatusContants"),
    cancelReasons = require("../constants/orderCancelReasons"),
    moment = require('moment'),
    config = require('../appConfig')

exports.getRecentOrdersForUser = function (req, callback) {

  var paramsForUrl = {}, options = {};

  function parseOrderHistoryResponse(err, data) {
    if (err) {
      callback(err, null);
    } else {
      var orderHistoryData = data[responseConstants.RESULTS][responseConstants.RECENT_ORDERS];

      //iterate over list of orders
      orderHistoryData.forEach(function (order) {
        var products = order.oprLineItems;

        //iterate over products in the order
        products.forEach(function (product) {
          product.productPageUrl = linkManager.getProductPageUrl(product.navKey, product.urlFragment);

          //product can be cancelled if it is in placed or in process state
          order.isCancellable = (product.status == oStatus.orderStatusInProcess
              || product.status == oStatus.orderStatusPlaced ) ? true : false;
        });
      });
      callback(null, orderHistoryData);
    }

  }


  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  paramsForUrl[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url: linkManager.getApiUrl(uris.USER_ACCOUNT.url, paramsForUrl)
  };
  apiUtils.httpRequest(options, parseOrderHistoryResponse);

}


exports.cancelOrder = function (req, cb) {

  var params = {}, options = {}, comments;


  comments = cancelReasons[req.body.reason];
  if(req.body.comments){
    comments += ' - ' + req.body.comments;
  }

  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.PAYMENT_RESOLUTION_MODE] = 2;
  params[requestConstants.CANCEL_DATE] = moment().format();
  params[requestConstants.API_ACCESS_KEY] = config.hkAPI.accessKey;
  params[requestConstants.GATEWAY_ORDER_ID] = req.body.gatewayOrderId;
  params[requestConstants.COMMENTS] = comments;


  options.body = params;

  options.url = linkManager.getApiUrl(uris.CANCEL_ORDER.url);
  options.method = 'POST';
  apiUtils.httpRequest(options, cb);

}