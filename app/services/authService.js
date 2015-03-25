var apiUtils = require('../utils/APIUtils'),
    uris = require('../constants/urlTemplates'),
    linkManager = require('../utils/LinkManager'),
    securityUtil = require('../utils/securityUtils'),
    requestConstants = require('../constants/rest/requestConstants'),
    responseConstants = require('../constants/rest/responseKeyConstants'),
    async = require('async'),
    logger = require('../utils/loggingUtils'),
    _ = require('underscore');

exports.getStoreList = function(req, cb) {

  var options = {
    url: linkManager.getApiUrl(uris.STORE_LIST.url, null)
  }
  apiUtils.httpRequest(options, cb);
}

/*
exports.setStoreId = function(req, cb) {
  req.body.st = 5;
  return;
};
*/

exports.validateLoginService = function(req, cb){
  var email = req.body.email ?req.body.email: '',
      password = req.body.password ? req.body.password : '',
      st = securityUtil.getStoreId(req),
      options,
      paramsForUrl,
      passwordHash;

  /**
   * Callback to validate the user login details
   * @param err
   * @param resp - response from api
   */
  function isValidLogin(err,resp){
    if(err){
      cb(err,null)
    } else {
      if(resp.results.pwd == passwordHash){

        cb(null,resp)
      } else {
        cb({msg:"Username/password incorrect"},null);
      }
    }
  }

  if(email.length ==0 || password.length == 0){
    cb({msg:"Username/password incorrect"},null);
    return
  }

  passwordHash = securityUtil.encryptPassword(password);



  paramsForUrl = {};

  paramsForUrl[requestConstants.STORE_ID] = st;
  paramsForUrl[requestConstants.USER_EMAIL] = email;
  options = {
    url : linkManager.getApiUrl(uris.LOGIN.url,paramsForUrl)
  }

  apiUtils.httpRequest(options,isValidLogin)

}

function isValidLogin(err,da){

}


exports.validateSignUp = function(req, cb){
  var name = req.body.name,
      email = req.body.email ?req.body.email: '',
      password = req.body.password ? req.body.password : '',
      cpassword = req.body.cpassword ? req.body.cpassword : '',
      roleKey = req.body.roleName ? req.body.roleName : '',
      st = securityUtil.getStoreId(req),
      options,
      paramsForBody = {},
      _self = this;



  //callback1 gets store list
  //callback2 signup a user
  async.parallel([function(callback){
    _self.getStoreList(req,callback)
  }, function(callback){

    var roles = securityUtil.getRolesList();

    /**
     * @TODO
     * add checks on roles provided by client
     */
    if (name.length ==0 || email.length ==0 || password.length == 0 || cpassword.length == 0){
      cb({msg:"All fields are compulsory"},null);
      //callback(null,{results:{exception:true,msgs:["All fields are compulsory"]}});
    } else if(password != cpassword){
      cb({msg:"Password and confirm password do not match"},null);
      //callback(null,{results:{exception:true,msgs:["Password and confirm password do not match"]}});
    }
    //TODO : Commented check for role - Uncomment, if required.
    /*else if(!securityUtil.isValidRole(roleKey)){
      logger.error("Security breach from : "+ securityUtil.getUserEmail(req)+". Tried to set role '"+roleKey+"' for "+email );
      cb({msg:"Please contact admin"},null);
      //callback(null,{results:{exception:true,msgs:["Please contact admin"]}});
    } */else {
      paramsForBody[requestConstants.STORE_ID_FOR_CART] = st;
      paramsForBody[requestConstants.EMAIL] = email;
      paramsForBody[requestConstants.NAME] = name;
      paramsForBody[requestConstants.PASSWORD] = password;
      paramsForBody[requestConstants.ROLE_NAME] = roles[roleKey];

      options = {
        body: {},
        url: linkManager.getApiUrl(uris.SIGNUP.url, null),
        method: 'POST'
      };

      options.body = paramsForBody;
      apiUtils.httpRequest(options, callback);
    }
  }],function(err,results){
    var response  = {};


    if (err){
      return cb(err)
    } else {
      _.extend(response,results[0])
      response.results.exception = results[1].results.exception;
      if(response.results.exception == true){
        cb({msg: results[1].results.msgs},null);
        //response.results.msgs = results[1].results.msgs;
      } else {
        response.results.msgs = ['Signup done for '+results[1].results.user.email+'. Please contact admin for mapping user to your id'];
      }

      return cb(null, response)
    }

  })


}


exports.validateAssumeLogin = function(req, cb){
  var email = req.body.login ?req.body.login : '',
      options,
      paramsForUrl;

  /**
   * Callback to validate the user login details
   * @param err
   * @param resp - response from api
   */
  function isValidLogin(err,resp){
    if(err){
      cb(err,null)
    } else {
      if(!resp[responseConstants.RESULTS][responseConstants.EXCEPTION]){
        cb(null,resp)
      } else {
        cb({msg:"User does not exist"},null);
      }
    }
  }

  if(email.length ==0){
    cb({msg:"Please enter user name"},null);
    return
  }


  paramsForUrl = {};

  paramsForUrl[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  paramsForUrl[requestConstants.USER_EMAIL] = email;
  options = {
    url : linkManager.getApiUrl(uris.LOGIN.url,paramsForUrl)
  }

  apiUtils.httpRequest(options,isValidLogin)

}

exports.getMappedUsers = function(req, cb) {

  var options = {},
      urlParams = [];

  urlParams[requestConstants.STORE_ID] = securityUtil.getStoreId(req);
  urlParams[requestConstants.USER_ID] = securityUtil.getUserId(req);

  options = {
    url: linkManager.getApiUrl(uris.MAPPED_USERS.url, urlParams)
  };
  apiUtils.httpRequest(options, cb);
}