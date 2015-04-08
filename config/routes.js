var urlConst = require('../app/constants/routesConstants'),
    securityUtils = require('../app/utils/securityUtils'),
    logger = require('../app/utils/loggingUtils');

module.exports = function(app){

  var bannerController = require('../app/controllers/bannerController')
  app.get('/hello',bannerController.renderBanners)

  var authController = require('../app/controllers/authController')
  app.get(urlConst.WEB.LOGIN,authController.login)
  app.post(urlConst.WEB.LOGIN,authController.validateLogin)
  app.get(urlConst.WEB.LOGOUT,authController.logout)

  app.get(urlConst.WEB.SIGN_UP,authController.signUp);
  app.post(urlConst.WEB.SIGN_UP,authController.validateSignUp);

  var productController = require('../app/controllers/productController')
  app.get(urlConst.WEB.MB_PRODUCTS, productController.renderProductPage);
  app.get(urlConst.WEB.MB_CONCERN, productController.renderConcernPage);

  app.get(urlConst.WEB.ASSUME_LOGIN,authController.assumeLogin);
  app.post(urlConst.WEB.ASSUME_LOGIN,authController.validateAssumeLogin);

  var homeController = require('../app/controllers/homeController');
  app.get(urlConst.WEB.HOME,homeController.home);

  var menuController = require('../app/controllers/menuController');
  app.get(urlConst.WEB.MENU, menuController.renderMenu);

  var catalogController = require('../app/controllers/catalogController');
  app.get(urlConst.WEB.PRODUCT, catalogController.getProductData);
  app.get(urlConst.API.CATALOG_LOAD_MORE, catalogController.getCatalogLoadMoreData);
  app.get(urlConst.WEB.CATALOG, catalogController.getCatalogData);
};