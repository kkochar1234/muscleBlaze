var authService = require("../services/authService"),
    securityUtil = require("../utils/securityUtils"),
    linkManager = require("../utils/LinkManager");

/**
 * renders login page
 * @param req
 * @param res
 */
exports.login = function(req,res){

  //req.body.st = 5;
  return res.cfaRender('auth/login', null,  null ,req,res);
  //authService.setStoreID(req, cb);
  //authService.getStoreList(req,cb);

}

/**
 * Controller to handle request for login
 * When successful redirects user to a page, else keep user on login screen
 * @param req
 * @param res
 */
exports.validateLogin = function(req, res){
  function cb(err,data){
    if(err){
      req.flash('message',[err.msg])
      return res.redirect('/login')
    } else {
      console.log("No error received while validating.")
      securityUtil.setSessionForUser(req,data)
      return res.redirect('/?login=true')
    }
  }
  authService.validateLoginService(req,cb)
}


/**
 * End a user session when user choose to end session, redirects user to login screen
 * @param req
 * @param res
 * @returns {*}
 */
exports.logout = function(req, res){
  if(securityUtil.isAssumedLogin(req)) {
    releaseAssumeLogin(req,res);
  } else {
    securityUtil.endSession(req,res);
    return res.redirect(linkManager.getLoginUrl());
  }
}


exports.signUp = function(req,res){

    res.cfaRender('auth/signUp', null ,null ,req,res)
}

/**
 * signing up a new user
 * @param req
 * @param res
 */
exports.validateSignUp = function(req, res){

  function cb(err,data){
    //res.cfaRender('auth/signUp', err,data,req,res)


    if (err) {
      console.log("Error while signing up : " + err.msg);
      req.flash('message', [err.msg])
      return res.redirect('/signUp')
    }
    else {
      console.log("Account got created.");
      return res.redirect('/login');
    }

  }

  authService.validateSignUp(req,cb)
}

exports.assumeLogin = function(req,res){

  if(securityUtil.isB2BManager(req)){
    function callback(err, data) {
      res.cfaRender('auth/assumeLogin', err,data,req,res)
    }
    authService.getMappedUsers(req, callback);
  } else {
    return res.redirect(linkManager.getHomeUrl())
  }

}

exports.validateAssumeLogin = function(req,res){

  function cb(err,data){
    if(err){
      req.flash('message',[err.msg]);
      return res.redirect('/assume/Login')
    } else {
      securityUtil.setAssumedUserDetails(req,data)
    }
    return res.redirect('/?assumeLogin=true')
  }

  authService.validateAssumeLogin(req,cb)

}

function releaseAssumeLogin(req,res){
  securityUtil.endSession(req);
  return res.redirect('/');

}