var async = require('async'),
    apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    securityUtil = require("../utils/securityUtils");

exports.getAddressForUser = function(req, cb) {

  async.parallel({
      addressList : function(callback) {
          getAddressList(req, callback);
      },
      stateList : function(callback) {
          getStateList(req, callback);
      }
    }, function(err, results) {
        cb(err, results);
  });

}
exports.getPincodeDetails = function(req, cb) {
  var parsePincodeResponse,
      params,
      options;

  parsePincodeResponse = function (err, resp) {
    if(err) {
      cb(err, null);
    } else {
      var addressData = resp[responseConstants.RESULTS].pin;
      cb(null, addressData)
    }
  }

  params = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params.pincode = req.param('pincode');

  options = {
    url : linkManager.getApiUrl(uris.PINCODE_DETAILS.url, params)
  }

  //call to api to get user cart data
  apiUtils.httpRequest(options, parsePincodeResponse);
}


exports.selectAddressForUser = function(req, cb) {

  var params = {};

  params[requestConstants.STORE_ID_FOR_CART] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params.name = req.body.name;
  params.contactNo = req.body.contactNo;
  params.alternateContactNo = req.body.alternateContactNo;
  params.line1 = req.body.line1;
  params.landmark = req.body.landmark;
  params.pincode = req.body.pincode;
  params.stateId = req.body.stateId;
  params.cityId = req.body.cityId;
  params.cityName = req.body.cityName;


  //if address id is not null --> update the existing address else add new address
  if(req.body.addressId && req.body.addressId.length > 0) {
    updateUserAddress(req, params, cb);
  } else {
    addUserAddress(req, params, cb);
  }

}

/**
 * update existing user address
 * @param req
 * @param params
 * @param callback
 */
function updateUserAddress(req, params, callback) {
  var options = {};

  params[requestConstants.ADDRESS_ID_PAYMENT] = req.body.addressId;
  options = {
    url : linkManager.getApiUrl(uris.ADDRESS_UPDATE.url, params),
    body : params,
    method : 'POST'
  }


  apiUtils.httpRequest(options, callback)
}


/**
 * add new user address
 * @param req
 * @param params
 * @param callback
 */
function addUserAddress(req, params, callback) {
  var options = {};

  options = {
    url : linkManager.getApiUrl(uris.ADDRESS_ADD.url, params),
    body : params,
    method : 'POST'
  }


  apiUtils.httpRequest(options, callback)
}



/**
 * delete user address
 * @param req
 * @param cb
 */

exports.deleteAddressForUser = function(req, cb) {

  var params = {},
      options;

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);
  params[requestConstants.ADDRESS_ID] = req.body.addressId;



  options = {
    url : linkManager.getApiUrl(uris.ADDRESS_DELETE.url, params)
  }

  apiUtils.httpRequest(options, cb)

}

var getAddressList = function(req, cb) {
  var parseAddressResponse,
      params,
      options;

  parseAddressResponse = function(err, resp) {
    var addressData;
    if(err) {
      cb(err, null);
    } else {
      addressData = resp[responseConstants.RESULTS][responseConstants.USER_ADDRESS]
      cb(null, addressData)
    }
  }

  params = {};

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url : linkManager.getApiUrl(uris.ADDRESS_LIST.url, params)
  }

  //call to api to get user cart data
  apiUtils.httpRequest(options, parseAddressResponse)

}

var getStateList = function(req, cb) {
  var parseStateListResponse,
      params = {},
      options = {};

  parseStateListResponse = function(err, resp) {
    var stateList;
    if(err) {
      cb(err, null);
    } else {
      stateList = resp[responseConstants.RESULTS].states;
      cb(null, stateList);
    }
  }

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  options = {
    url : linkManager.getApiUrl(uris.STATE_LIST.url, params)
  }

  //call to api to get user cart data
  apiUtils.httpRequest(options, parseStateListResponse)
}