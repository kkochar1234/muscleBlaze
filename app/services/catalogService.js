var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    _ = require('underscore'),
    appConstants = require('../constants/appConstants'),
    requestConstants = require('../constants/rest/requestConstants'),
    securityUtil = require("../utils/securityUtils");

exports.getCatalogData = function (req, cb) {

  var navKey = req.query.navKey,
      params = {},
      options = {};

  /**
   * callback --> parse api response to find catalog data
   * @callback
   * @param err
   * @param data
   */
  function parseCatalogData(err, data) {

    if (err) {
      cb(err, null)
    } else {
      var catalogData = data.results.variants;
      //forming custom url of each variant
      catalogData.forEach(function (data) {
        data.url = linkManager.getProductPageUrl(data.navKey, data.urlFragment)
      });
      cb(null, data)
    }
  }

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params['navKey'] = navKey;

  options = {
    url: linkManager.getApiUrl(uris.CATALOG.url, params)
  }

  //call to api to get catalog data
  apiUtils.httpRequest(options, parseCatalogData)

}

exports.getCatalogLoadMoreData = function (req, cb) {

  var catPrefix = req.query.catPrefix,
      pageNo = req.query.pageNo ? req.query.pageNo : 1,
  params = {},
      options = {};

  /**
   * callback --> parse api response to find catalog data
   * @callback
   * @param err
   * @param data
   */
  function parseCatalogData(err, data) {

    if (err) {
      cb(err, null)
    } else {
      var catalogData = data.results.variants;
      //forming custom url of each variant
      catalogData.forEach(function (data) {
        data.url = linkManager.getProductPageUrl(data.navKey, data.urlFragment)
      });
      cb(null, catalogData)
    }
  }

  params[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  params['catPrefix'] = catPrefix;
  params['pageNo'] = pageNo;

  options = {
    url: linkManager.getApiUrl(uris.CATALOG_PAGINATION.url, params)
  }

  //call to api to get catalog data
  apiUtils.httpRequest(options, parseCatalogData)

}

exports.getProductData = function (req, cb) {

  var navKey = req.query.navKey,
      variantId,
      productId,
      searchByProductId = false,
      paramsForUrl = {};




  //parse navKey to get variantId
  if (!_.isEmpty(navKey)) {
    variantId = getVariantIdFromNavKey(navKey);
    if (variantId == null) {
      //if variant id is null
      searchByProductId = true;
    }
  } else {
    //if nav key is empty or null
    searchByProductId = true;
  }

  //parse url to find product id
  if (searchByProductId) {
    // TODO: handling by product id if variant id is NULL
  }

  paramsForUrl[requestConstants.VARIANT_ID] = variantId;
  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);

  options = {
    url: linkManager.getApiUrl(uris.VARIANT_DETAIL.url, paramsForUrl)
  }

  //call to api to get catalog data
  apiUtils.httpRequest(options, cb)

}

/**
 * parse navKey to find store variant id
 * @param navKey - string containg variant id
 * @returns {*}
 */
getVariantIdFromNavKey = function (navKey) {
  if (!_.isEmpty(navKey)) {
    navKey = navKey.toLowerCase();
    var variantLPIdentifier = appConstants.PAGE_CONSTANTS.VARIANT_LP_IDENTIFIER.toLowerCase();
    if (navKey.indexOf(variantLPIdentifier) >= 0) {
      return (navKey.replace(variantLPIdentifier, ''));
    }
    return null;
  }
  return null;
}

/**
 * extracts the product id, this method is called when variant id is not provided
 * @param variantSlug - string containing the product id
 * @returns {*}
 */
getProductIdFromVariantSlug = function (variantSlug) {
  if (!_.isEmpty(variantSlug)) {
    variantSlug = variantSlug.toLowerCase();
    var spKeyPrefix = appConstants.PAGE_CONSTANTS.STORE_PRODUCT_KEY_PREFIX.toLowerCase();
    if (variantSlug.lastIndexOf(spKeyPrefix) >= 0) {
      return (variantSlug.replace(spKeyPrefix, ''));
    }
    return null;
  }
  return null;
}