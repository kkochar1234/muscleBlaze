var md5 = require('blueimp-md5').md5,
    keyConstants = require('../constants/rest/responseKeyConstants'),
    appConstants = require('../constants/appConstants'),
    roles,
    _ = require('underscore'),
    storeId;


roles = {
  HK_USER : 'HK_USER',
  HK_UNVERIFIED : 'HKUNVERIFIED'
}

Object.freeze(roles)

exports.getRolesList = function(){
  return roles
}

/**
 * Converts plaintext password to a hash and then converts it to base64 text
 * @param password
 * @returns {*|String}
 */
exports.encryptPassword = function(password){
  return new Buffer(md5(password), 'hex').toString('base64')
}

/**
 * checks if a user have correct access
 * @param req
 * @param data
 * @returns {boolean}
 */
exports.isValidUser = function(passwordHash,data){
  if(data.pwd === passwordHash){
    data.results[keyConstants.USER_ROLES]
  } else {
    return false
  }
  return true
}

/**
 * check if given role is a qualified role
 * @param role
 * @returns {boolean}
 */
exports.isValidRole = function(role){
  var flag = false;
  if(roles.hasOwnProperty(role)){
    flag = true
  }
  return flag
}

/**
 * update session with user info from API response
 * @param req - request object
 * @param data - response received from API
 */
exports.setSessionForUser = function(req,data){
  setUserEmail(req,data)
  setRoles(req,data)
  setStoreId(req,data)
  setUserId(req,data)
  setUserName(req,data)
  //req.session.gender = data.results[keyConstants.USER_GENDER];
  //req.session.roles = data.results[keyConstants.USER_ROLES];
  //req.session.st = data.results[keyConstants.STORE_ID];
  //req.session.userId = data.results[keyConstants.USER_ID]
}

/**
 * checks if a user has admin role
 * @param req
 * @returns {boolean}
 */
exports.isAdmin = function(req){
  var userRoles = this.getRoles(req)

  return (userRoles.indexOf(roles.USER_ADMIN) >= 0)

}

/**
 * checks if a user have role to create account
 * @param req
 * @returns {boolean}
 */
exports.isB2BManager = function(req){
  var userRoles = this.getRoles(req)

  return (userRoles.indexOf(roles.B2B_MANAGER) >= 0) || (userRoles.indexOf(roles.USER_ADMIN) >= 0)
}

/**
 * checks if it is a valid session, i.e., the user is HK_USER
 * @param req - request object
 * @returns {boolean}
 */
exports.isValidSession = function(req){
  var userRoles = req ? getSuperUserRoles(req) : []

  return (userRoles.indexOf(roles.HK_USER) >= 0 || userRoles.indexOf(roles.HK_UNVERIFIED) >= 0)
}

/**
 * end a user session - if assume login, then release assume login otherwise removes session cookie from response
 * @param req - request object
 * @param res - response object
 */
exports.endSession = function(req,res){
  if(this.isAssumedLogin(req)) {
    this.releaseAssumeLogin(req);
  } else {
    req.session.reset();
    res.clearCookie("session");
  }
}

exports.getUserEmail = function(req){
  if(this.isAssumedLogin(req)) {
    return getAssumedUserDetails(req).email;
  }
  return req.session ? req.session.email : '';
}

exports.getRoles = function(req){
  if(this.isAssumedLogin(req)) {
    return getAssumedUserDetails(req).roles;
  }
  return req.session.roles ? req.session.roles : []
}

exports.getStoreId = function(req){
  if(this.isAssumedLogin(req)) {
    return getAssumedUserDetails(req).st;
  }
  return req.session.st ? req.session.st : appConstants.DEFAULT_VALUES.DEFAULT_STORE_ID ;
}

exports.getUserId = function(req){
  if(this.isAssumedLogin(req)) {
    return getAssumedUserDetails(req).userId;
  }
  return req.session.userId
}

exports.getUserName = function(req){
  if(this.isAssumedLogin(req)) {
    return getAssumedUserDetails(req).name;
  }
  return req.session.name
}

exports.setAssumedUserDetails = function(req, data) {
  var assumedUserDetails = {};
  assumedUserDetails.email = data.results[keyConstants.USER_EMAIL];
  assumedUserDetails.name = data.results[keyConstants.NAME];
  assumedUserDetails.st = data.results[keyConstants.STORE_ID];
  assumedUserDetails.userId = data.results[keyConstants.USER_ID];
  assumedUserDetails.roles = data.results[keyConstants.USER_ROLES];

  req.session.assumedUserDetails = assumedUserDetails;
}


exports.releaseAssumeLogin = function(req) {
  req.session.assumedUserDetails = {};
}

exports.isAssumedLogin = function(req) {
  if(getAssumedUserDetails(req) && !_.isEmpty(getAssumedUserDetails(req))) {
    return true;
  }
  return false;
}

function setUserEmail(req,data){
  req.session.email = data.results[keyConstants.USER_EMAIL];
}

function setUserName(req,data){
  req.session.name = data.results[keyConstants.NAME];
}

function setRoles(req,data){
  req.session.roles = data.results[keyConstants.USER_ROLES];
}


function setStoreId(req,data){
  req.session.st = data.results[keyConstants.STORE_ID];
  /*if (data.results[keyConstants.STORE_ID].type() == undefined)
    req.session.st = appConstants.DEFAULT_VALUES.DEFAULT_STORE_ID
*/
}


function setUserId(req,data){
  req.session.userId = data.results[keyConstants.USER_ID];
}

function getAssumedUserDetails(req) {
  return req.session && req.session.assumedUserDetails ? req.session.assumedUserDetails : null;
}

/**
 * returns the user roles of the logged in user --> in case of assume login, it will return the roles of super user
 * @param req
 * @returns {*}
 */
function getSuperUserRoles(req){
  return req.session.roles ? req.session.roles : []
}

