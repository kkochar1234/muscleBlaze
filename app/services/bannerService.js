var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    securityUtil = require('../utils/securityUtils'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    appConstants = require('../constants/appConstants'),
    async = require('async'),
    logger = require('../utils/loggingUtils'),
    _ = require('underscore');

exports.renderBanners = function (req, cb) {

  var st = appConstants.DEFAULT_VALUES.DEFAULT_STORE_ID,
  //TODO : retrieve nav_key from request.
      nav_key = req.query.navKey ? req.query.navKey : "HM",
      options,
      params = {};

  function callback(err, data) {

    if (err) {
      return cb(err)
    } else {
      if (data.results.exception == true) {
        cb({msg: data.results.msgs}, null);
      } else {
        data.results.msgs = ['Banners retrieved for ' + nav_key];
      }

      return cb(null, data)
    }
  }

  if (nav_key.length ==0){
    cb({msg:"Nav Key is null"},null);
  } else {
    params[requestConstants.STORE_ID] = st;
    params[requestConstants.NAV_KEY] = nav_key;

    options = {
      url: linkManager.getApiUrl(uris.PAGE_BANNERS.url, params)
    };
    apiUtils.httpRequest(options, callback);
  }

}
