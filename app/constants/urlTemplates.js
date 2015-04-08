//module with all the url templates used by application to interact with api server

module.exports = {
  CART_ADD : {url : "/cart/add", method : "POST", params : []},
  CATALOG : {url : "/catalog/results/{navKey}?&st={st}", method : "GET"},
  CATALOG_PAGINATION : {url : "/catalog/results/?&st={st}&pageNo={pageNo}&catPrefix={catPrefix}", method : "GET"},
  CART_DATA : {url : "/cart/get/{st}/{userId}", method : "GET"},
  LOGIN : {url : "/user/name/{st}/{user}", method : "GET", params : []},
  MENU : {url : "/menu/{st}", method : "GET", params : []},
  VARIANT_DETAIL : {url : "/variant/{svId}?st={st}", method : "GET", params : []},
  ADDRESS_LIST : {url : "/user/address/{st}/{userId}/list", method : "GET", params : {}},
  STATE_LIST : {url : "/location/country/code/IN/states?st={st}", method : "GET", params : {}},
  PINCODE_DETAILS : {url : "/location/pincode/{pincode}/details?st={st}", method : "GET", params : {}},
  ADDRESS_ADD : {url : "/user/address/create", method : "POST", params : {}},
  ADDRESS_UPDATE : {url : "/user/address/update", method : "POST", params : {}},
  ADDRESS_DELETE : {url : "/user/address/delete/{st}/{userId}/{adrsId}", method : "GET", params : {}},

  PAYMENT_PREPARE : {url : "/payment/{st}/{userId}/prepare?adrsId={adrsId}&payTp={payTp}", method : "GET", params : {}},
  CART_UPDATE : {url : "/cart/update", method : "POST", params : {}},
  CART_VARIANT_REMOVE : {url : "/cart/remove", method : "POST", params : {}},
  PAYMENT_MODE : {url : "/payment/createMap/", method : "POST", params : {}},
  PAYMENT_ACCEPT : {url : "/payment/{st}/{userId}/{nativePayMode}/nativePayment", method : "POST", params : {}},
  ADDRESS_GET : {url : "/user/address/get/{st}/{adrsId}", method : "GET", params : {}},
  USER_GET : {url : "/user/id/{userId}", method : "GET", params : {}},
  STORE_LIST : {url : "/store/type/2", method: "GET", params: []},
  COUPON_APPLY : {url : "/cart/applyCoupon/{st}/{userId}/{couponCode}", method : "GET", params : {}},
  OFFER_APPLY : {url:"/cart/applyOffer/{st}/{userId}/{offId}",method:"GET"},
  OFFER_REMOVE : {url : "/cart/removeOffer/{st}/{userId}", method : "GET", params : {}},
  REWARD_POINTS_REDEEM : {url : "/cart/redeem/{st}/{userId}/{rewardPoint}", method : "GET", params : {}},
  USER_ACCOUNT : {url : "/order/recent/{st}/{userId}", method : "GET", params : {}},
  CANCEL_ORDER : {url : "/order/cancelMyAccount", method : "POST", params : {}},

  SIGNUP : {url : "/user/signup", method : "POST", params : []},
  MAPPED_USERS : {url : "/user/mappedUsers/{st}/{userId}", method : "GET", params : []},
  REWARD_POINTS_INFO : {url : "/userPoints/reward/{st}/{userId}/points", method : "GET", params : []},

  PAGE_BANNERS : {url : "/page/data/{st}/{navKey}", method : "GET", params : {}},

  PRODUCT_PAGE : {url : "/posts/{postId}", method : "GET", params : {}}

}

