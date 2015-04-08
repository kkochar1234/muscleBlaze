var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    securityUtil = require('../utils/securityUtils'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    appConstants = require('../constants/appConstants'),
    async = require('async'),
    logger = require('../utils/loggingUtils'),
    _ = require('underscore'),
    menuService = require('./menuService');

exports.renderProductPage = function (req, cb) {
    async.parallel({
      productDetails : function(callback) {
        renderProduct(req, callback);
      },
      productMenu : function(callback) {
        menuService.getMenuNodes(req, callback);
      }
    }, function(err, results) {
      cb(err, results);
    });
}

function renderProduct (req, cb) {

  function callback(err, data) {

    if (err) {
      return cb(err)
    } else {
      if (data.content == null) {
        cb({msg: "No Content received"}, null);
      } /*else {
       data.results.msgs = ['Banners retrieved for ' + nav_key];
       }*/

      return cb(null, data)
    }
  }
  var postId = req.params.productName,
  //TODO : retrieve post_id from request.
      options,
      params = {};

  if (postId.length == 0) {
    cb({msg: "Post Id is null"}, null);
  } else {
    params[requestConstants.POST_ID] = postId;

    options = {
      url: linkManager.getWordPressUrl(uris.PRODUCT_PAGE.url, params)
    };
    apiUtils.httpRequest(options, callback);
  }
}

exports.renderConcernPage = function (req, cb) {
  async.parallel({
    concernDetails : function(callback) {
      renderConcern(req, callback);
    },
    productMenu : function(callback) {
      menuService.getMenuNodes(req, callback);
    }
  }, function(err, results) {
    cb(err, results);
  });
}


function renderConcern (req, cb) {

  function callback(err, data) {

    if (err) {
      return cb(err)
    } else {
      if (data.content == null) {
        cb({msg: "No Content received"}, null);
      } /*else {
       data.results.msgs = ['Banners retrieved for ' + nav_key];
       }*/

      return cb(null, data)
    }
  }
  var postId = req.params.concern,
      options,
      params = {};

  if (postId.length == 0) {
    cb({msg: "Post Id is null"}, null);
  } else {
    params[requestConstants.POST_ID] = postId;

    options = {
      url: linkManager.getWordPressUrl(uris.PRODUCT_PAGE.url, params)
    };
    apiUtils.httpRequest(options, callback);
  }
}