var pageConstants = {
  HOME : {
    view : 'home',
    identifier : 'home'
  },
  LOGIN : {
    view : 'auth/login',
    identifier : 'login'
  },
  CATALOG : {
    view : 'catalog/catalog',
    identifier : 'catalog'
  },
  CART : {
    view : 'cart/cart',
    identifier : 'cart'
  },
  PRODUCT : {
    view : 'catalog/product',
    identifier : 'product'
  },
  ADDRESS : {
    view : 'address/address',
    identifier : 'address'
  },
  ASSUME_LOGIN : {
    view : 'auth/assumeLogin',
    identifier : 'assumeLogin'
  },
  ORDER_SUCCESS : {
    view : 'order/orderStatus',
    identifier : 'orderSuccess'
  }
}

Object.freeze(pageConstants)

module.exports = pageConstants