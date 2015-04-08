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
    bannerService = require('./bannerService');

exports.renderHomePage = function (req, cb) {
    async.parallel({
      bannerDetails : function(callback) {
        bannerService.renderBanners(req, callback);
      },
      productMenu : function(callback) {
        menuService.getMenuNodes(req, callback);
      }
    }, function(err, results) {
      cb(err, results);
    });
}
