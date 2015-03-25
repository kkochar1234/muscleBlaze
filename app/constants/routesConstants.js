//Module with all the routes used by application, when user interacts with app

var routes = {
  API : {
    CART_UPDATE : '/api/cart/variant/update',
    CART_REMOVE : '/api/cart/variant/remove',
    CATALOG_LOAD_MORE : '/api/catalog/results',
    PINCODE_DETAILS: '/api/location/pincode/:pincode/details',
    COUPON_APPLY: '/api/cart/applyCoupon/:couponCode',
    OFFER_REMOVE: '/api/cart/removeOffer',
    ADDRESS_DELETE : '/api',
    REWARD_POINTS_REDEEM : '/api/cart/redeemPoints/:rewardPoints',
    APPLY_OFFER : '/api/cart/applyOffer/:offerId',
    CANCEL_ORDER : '/api/order/cancel'

  },
  WEB : {
    HOME : '/',
    MENU : "/menu",
    LOGIN : '/login',
    LOGOUT : '/logout',
    CART_ADD : '/cart/add',
    CART_GET : '/cart',
    CATALOG : '/:primary/:secondary',
    PRODUCT : '/sv/:productName/:productId',
    ADDRESS_SELECT : '/order/selectAddress',
    ADDRESS_ADD : '/user/addAddress',
    ADDRESS_DELETE : '/user/deleteAddress',
    PAYMENT_PREPARE : '/order/prepare/payment',
    PAYMENT_MAKE : '/make/payment',
    ORDER_HISTORY : '/user/order/history',
    SIGN_UP : '/signUp',
    ASSUME_LOGIN : '/assume/login'

  }
};

Object.freeze(routes)

module.exports = routes