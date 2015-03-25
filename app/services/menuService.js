var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    requestConstants = require('../constants/rest/requestConstants'),
    securityUtil = require("../utils/securityUtils");

exports.getMenuNodes = function(req, cb) {

  var paramsForUrl = {},
      options = {};

  /**
   * callback --> parse api response to find menu nodes - menu nodes will be in results --> tpMenuNode
   * @callback
   * @param err
   * @param resp
   */
  function parseMenuNodes(err, resp) {
    if(err) {
      cb(err, null)
    } else {
      var menuNodes = resp[responseConstants.RESULTS][responseConstants.MENU_NODE_PRIMARY];
      //forming custom url of each menu node
      menuNodes.forEach(function (menuNode) {
        var childNodes = menuNode[responseConstants.MENU_NODE_CHILD];
        childNodes.forEach(function(childNode) {
          childNode.url = linkManager.getMenuNodeUrl(childNode.navKey, childNode.urlFragment)
        });
      });
      cb(null, resp)
    }
  }

  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);

  options = {
    url : linkManager.getApiUrl(uris.MENU.url, paramsForUrl)
  }

  //call to api to get menu nodes
  apiUtils.httpRequest(options,parseMenuNodes)

}