var urlConst = require('../app/constants/routesConstants'),
    securityUtils = require('../app/utils/securityUtils'),
    logger = require('../app/utils/loggingUtils');

module.exports = function(app){

  app.get('/hello',function(req,res){
    res.render('hello')
  })
  var authController = require('../app/controllers/authController')
  app.get(urlConst.WEB.LOGIN,authController.login)
  app.post(urlConst.WEB.LOGIN,authController.validateLogin)
  app.get(urlConst.WEB.LOGOUT,authController.logout)

  app.get(urlConst.WEB.SIGN_UP,authController.signUp);
  app.post(urlConst.WEB.SIGN_UP,authController.validateSignUp);

  //all urls that need authorization are added after this
  app.all("*",function(req,res,next){
    logger.info("Request from client for URL : " +req.url);
    if(!(securityUtils.isValidSession(req))){
      req.flash('message','Unauthorized Access')
      return res.redirect('/login')
    } else {
      next()
    }

  })

  app.get(urlConst.WEB.ASSUME_LOGIN,authController.assumeLogin);
  app.post(urlConst.WEB.ASSUME_LOGIN,authController.validateAssumeLogin);

/*
  var paymentController = require('../app/controllers/paymentController');
  app.post(urlConst.WEB.PAYMENT_MAKE, paymentController.makePayment);
  app.get(urlConst.WEB.PAYMENT_PREPARE, paymentController.preparePaymentForCart);

  var userController = require('../app/controllers/userController');
  app.get(urlConst.WEB.ORDER_HISTORY, userController.getRecentOrdersForUser);
  app.post(urlConst.API.CANCEL_ORDER, userController.cancelOrder);

*/

  var homeController = require('../app/controllers/homeController');
  app.get(urlConst.WEB.HOME,homeController.home);

  var menuController = require('../app/controllers/menuController');
  app.get(urlConst.WEB.MENU, menuController.renderMenu);

/*
  var cartController = require('../app/controllers/cartController');
  app.post(urlConst.WEB.CART_ADD, cartController.addToCart);
  app.get(urlConst.WEB.CART_GET, cartController.getCartData);
  app.post(urlConst.API.CART_UPDATE, cartController.updateCart);
  app.post(urlConst.API.CART_REMOVE, cartController.removeVariantFromCart);
  app.get(urlConst.API.COUPON_APPLY, cartController.applyCoupon);
  app.get(urlConst.API.OFFER_REMOVE, cartController.removeOffer);
  app.get(urlConst.API.REWARD_POINTS_REDEEM, cartController.redeemRewardPoints);
  app.get(urlConst.API.APPLY_OFFER, cartController.applyOffer);


  var addressController = require('../app/controllers/addressController');
  app.get(urlConst.WEB.ADDRESS_SELECT, addressController.getAddressForUser);
  app.post(urlConst.WEB.ADDRESS_DELETE, addressController.deleteAddress);
  app.post(urlConst.WEB.ADDRESS_ADD, addressController.selectAddressForUser);
  app.get(urlConst.API.PINCODE_DETAILS, addressController.getPincodeDetails);
*/
  var catalogController = require('../app/controllers/catalogController');
  app.get(urlConst.WEB.PRODUCT, catalogController.getProductData);
  app.get(urlConst.API.CATALOG_LOAD_MORE, catalogController.getCatalogLoadMoreData);
  app.get(urlConst.WEB.CATALOG, catalogController.getCatalogData);



};