var uriTemplate = require('uritemplate'),
    routesConstants = require('../constants/routesConstants'),
    appConfig = require('../appConfig'),
    _ = require('underscore'),
    appConstants = require('../constants/appConstants'),
    menuService = require('../services/menuService');

exports.getApiUrl = function(URI,params){
  return getURL(appConfig.hkAPI.url+URI, params)
}

exports.getWordPressUrl = function(URI,params){
  return getURL(appConfig.wpAPI.url+URI, params)
}

exports.getWebUrl = function(URI,params){
  return getURL(appConfig.web.url+URI, params)
}

var getURL = function(url,params){
  if ( params != null && typeof params == 'object'){
    return uriTemplate.parse(url).expand(params)
  } else {
    return url
  }
}

//TODO: refactor custom url methods

exports.getMenuNodeUrl = function(navKey, urlFragment) {
  var url = appConfig.web.url;
  if(!_.isEmpty(navKey)) {
    if(navKey.indexOf(appConstants.PAGE_CONSTANTS.BRAND_LP_IDENTIFIER) >= 0) {
      //brand page url
      url += getBrandPageUrl(navKey, urlFragment)
    } else {
      //generic landing page
      //url += getGenericLandingPageUrl(navKey, urlFragment)
      url += getMbProductUrl(navKey, urlFragment);
    }
  }
  return url;
}

var getMbPostsId = function(urlFragment) {
  var map = {};
  //TODO : Add entries for menuTree.
  map["/supplements/supplements"] =  "877";
  map["/protein-bar"] = "885";
  return map[urlFragment];
}

var getMbProductUrl = function(navKey, urlFragment) {
  var mbProductUrl = appConfig.web.url;
  urlFragment.toString()
  var mbNavKey = getMbPostsId(urlFragment);
  mbProductUrl += appConstants.PAGE_CONSTANTS.MB_PRODUCT_PREFIX  +  "/" + mbNavKey + "/";
  return mbProductUrl;
}


var getBrandPageUrl = function(navKey, brandUrlFragment) {
  var brandPageUrl = appConstants.PAGE_CONSTANTS.BRAND_KEY_PREFIX;
  brandPageUrl += brandUrlFragment;
  brandPageUrl += "?" + appConstants.PAGE_CONSTANTS.NAV_KEY + "=" + navKey;
  return brandPageUrl;
}

var getGenericLandingPageUrl = function(navKey, urlFragment) {
  var genericLandingPageUrl = urlFragment + "?" + appConstants.PAGE_CONSTANTS.NAV_KEY + "=" +navKey;
  return genericLandingPageUrl;
}

exports.getProductPageUrl = function(navKey, urlFragment) {
  var productPageUrl = appConfig.web.url;
  productPageUrl += appConstants.PAGE_CONSTANTS.STORE_VARIANT_KEY_PREFIX;
  productPageUrl += getGenericLandingPageUrl(navKey, urlFragment);
  return productPageUrl;
}

exports.getConcernPageUrl = function(navKey, urlFragment) {
  var mbProductUrl = appConfig.web.url;
  urlFragment.toString()
  var mbNavKey = getMbConcernId(urlFragment);
  mbProductUrl +=  "/" + mbNavKey + "/";
  return mbProductUrl;
}

var getMbConcernId = function(urlFragment) {
  var map = {};
  //TODO : Add entries for menuTree.
  map["/supplements"] =  "1200";
  return map[urlFragment];
}

exports.getCssUrl = function(filePath){
  if(typeof filePath != 'string'){
    throw new TypeError("filepath can only be of type string")
  }
  return appConfig.web.css+filePath
}

exports.getJsUrl = function(filePath){
  if(typeof filePath != 'string'){
    throw new TypeError("filepath can only be of type string")
  }
  return appConfig.web.js+filePath
}

exports.getHomeUrl = function(){
  return this.getWebUrl(routesConstants.WEB.HOME)
}

exports.getAssumeLoginUrl = function(){
  return this.getWebUrl(routesConstants.WEB.ASSUME_LOGIN)
}

exports.getCartUrl = function(){
  return this.getWebUrl(routesConstants.WEB.CART_GET)
}

exports.getLoginUrl = function(){
  return this.getWebUrl(routesConstants.WEB.LOGIN)
}

exports.getLogoutUrl = function(){
  return this.getWebUrl(routesConstants.WEB.LOGOUT)
}

exports.getSignupUrl = function(){
  return this.getWebUrl(routesConstants.WEB.SIGN_UP)
}

exports.getOrderHistoryUrl = function(){
  return this.getWebUrl(routesConstants.WEB.ORDER_HISTORY)
}

exports.getPaymentPageUrl = function(addressId){
  return this.getWebUrl(routesConstants.WEB.PAYMENT_PREPARE) + '?selectedAddressId=' +addressId

}

exports.getCatalogPagination = function(catPrefix,pageNo){
  return this.getWebUrl(routesConstants.API.CATALOG_LOAD_MORE)+'?catPrefix='+catPrefix+'&pageNo='+pageNo
}

exports.getAddressPageUrl = function(){
  return this.getWebUrl(routesConstants.WEB.ADDRESS_SELECT)
}

exports.getAddressDeleteUrl = function(){
  return this.getWebUrl(routesConstants.WEB.ADDRESS_DELETE)
}