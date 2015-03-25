/**
 * default config for ajax
 */

var HK = {};

HK.GLBLS = {
  api:'/api'
}

var CONTEXT_ROOT='';


/** Maintain objects needed across application End **/
HK.utils = {};

//Auto scroll from one section to another
HK.utils.Scroll = {};

HK.POPUP = {
  THEME: {
    ALERT: 'popup-theme-orange'
  }
};

HK.Ajax = function () {

  return {

    customReq: function (reqObj) {
      var def = {
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        cache: false,
        success: function (json) {
          console.log(json)
        },
        error: function (xhr, a_status) {
          var errorMsg;
          if (typeof onError === "function") {
            onError.call(this, xhr, a_status);
          } else if (a_status === "error") { // Expected status: timeout/error/notmodified/parsererror
            if (xhr.status == 404) {
              errorMsg = " This request does not exist.";
            } else if (xhr.status == 500) {
              errorMsg = "An unexpected error occurred on server while processing this request. Try Again."
            }
          } else if (a_status === "timeout") {
            errorMsg = "Stay the patient course. Of little worth is your ire. The network is down."
          } else if (a_status === "parsererror") {
            errorMsg = "Yesterday it worked. Today it is not working. The response from server couldn't be processed properly."
          }
          if (errorMsg) {
            HK.alert({title: 'We cannot allow that', content: errorMsg, theme: HK.POPUP.THEME.ALERT});
          }
        },
        beforeSend: function (xhr) {
          if (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
          }
        }
      };
      var ajaxObj = $.extend(def, reqObj);
      jQuery.ajax(ajaxObj);
    }
  };
}();

HK.Cart = {
  elm: {
    //individaul item details

    cartItem: '[data-role=item]',
    itemQuantity: '[data-role=item-quantity]',
    itemMinus: '[data-role=item-minus]',
    itemPlus: '[data-role=item-plus]',
    packQuantity: '[data-role=pack-quantity]',
    packMinus: '[data-role=pack-minus]',
    packPlus: '[data-role=pack-plus]',
    itemRemove: '[data-role=item-remove]',
    packRemove: '[data-role=pack-remove]',
    itemOfferPrice: '[data-role=item-offer-price]',
    itemMrpPrice: '[data-role=item-mrp-price]',
    packOfferPrice: '[data-role=pack-offer-price]',
    packMrpPrice: '[data-role=pack-mrp-price]',
    packItemQuantity: '[data-role=pack-item-quantity]',
    //cart summary details
    cartSummary: '[data-role=cart-summary]',
    totalPayable: '[data-role=total-payable]',
    totalMrpPrice: '[data-role=total-mrp-price]',
    totalOfferPrice: '[data-role=total-offer-price]',
    promoDiscount: '[data-role=promo-discount]',
    shippingCharges: '[data-role=shipping-charges]',
    totalSave: '[data-role=total-save]',
    //offers

    // cartOffer : '.offers-container'
    cartOffer: '.prompt-offers-cnt',
    cashBack: '[data-role=cash-back]',
    variantFreebieItem: '[data-role=freebie-item]',
    variantFreebieQty: '[data-role=vrnt-freebie-qty]',
    totalDiscount: '[data-role=total-discount]'


  },
  events: {
    update: 'update',
    packUpdate: 'packUpdate',
    offerUpdate: 'cartOfferUpdate',
    add: 'add',
    packAdd: 'packAdd',
    sub: 'sub',
    packSub: 'packSub',
    remove: 'drop',
    packRemove: 'packDrop'
  }




}

HK.urls = {
  autoCompleter: HK.GLBLS.api + '/ac/results',
  addPackToCart: HK.GLBLS.api + '/cart/pack/add',
  updatePackInCart: HK.GLBLS.api + '/cart/pack/update',
  removePackFromCart: HK.GLBLS.api + '/cart/pack/remove',
  addVariantToCart: HK.GLBLS.api + '/cart/variant/add',
//  addVariantToCart: HK.GLBLS.api + '/cart/productVariant/add',
  addVariantWithExtOp: HK.GLBLS.api + '/cart/productVariantExtOpt/add',
  updateVariantInCart: HK.GLBLS.api + '/cart/variant/update',
  removeFromCart: HK.GLBLS.api + '/cart/variant/remove',
  headerSummary: HK.GLBLS.api + '/header/summary',
  review: HK.GLBLS.api + '/variant/review/',
  reviewRate: HK.GLBLS.api + '/variant/review/rate',
  addReview: HK.GLBLS.api + '/variant/review/add',
  reviewVote: '/vote?voteType=',
  cartPage: HK.GLBLS.cntxt + '/cart/Cart.action',
  activationEmail: HK.GLBLS.api + "/email/activate",
  /*variantPage: HK.GLBLS.cntxt + "/variant/StoreVariant.action",*/
  boughtTogether: HK.GLBLS.api + "/variant/",
  paymentCreate: HK.GLBLS.api + "/payment/create",
  locationApi: HK.GLBLS.api + "/location",
  //offers,coupons
  applyOffer: HK.GLBLS.api + '/cart/applyOffer',
  removeOffer: HK.GLBLS.api + '/cart/removeOffer',
  applyCoupon: HK.GLBLS.api + '/cart/applyCoupon',
  removeCoupon: HK.GLBLS.api + '/cart/removeCoupon',
  rewardPoint: HK.GLBLS.api + '/reward/results',
  loyaltyPoint: HK.GLBLS.api + '/loyalty/results',
  notifyUserDetails: HK.GLBLS.api + '/enquiry/details',
  notifyUpdate: HK.GLBLS.api + '/enquiry/notifyMe/update',
  speakToNutritionistDetails: HK.GLBLS.api + '/enquiry/details',
  speakToNutritionistSubmit: HK.GLBLS.api + '/enquiry/speakToN/update',
  speakToFEDetails: HK.GLBLS.api + '/enquiry/details',
  speakToFESubmit: HK.GLBLS.api + '/enquiry/speakToFE/update',
  subscribeForMails: HK.GLBLS.api + '/subscribe/',
  variantOffer: HK.GLBLS.api + '/pack/',
  getAllVariantsToCompare: HK.GLBLS.api + '/variant/compare/all',
  addVariantToCompare: HK.GLBLS.api + '/variant/compare/add',
  removeVariantToCompare: HK.GLBLS.api + '/variant/compare/remove',
  removeAllVariantsToCompare: HK.GLBLS.api + '/variant/compare/remove/all',
  //catalog page api links
  urlRoot: CONTEXT_ROOT + "/catalog/result/rq",
  searchUrlRoot: CONTEXT_ROOT + "/api/search/results",
  targetMantraUrl: 'http://api.targetingmantra.com/TMWidgets',
  variantReviews: HK.GLBLS.api + "/variant/browse/",

  browseUrl: HK.GLBLS.api + "/variant/browse/",
  redeemPts: HK.GLBLS.api + "/cart/redeemPoints",
  sendPaymentMode: HK.GLBLS.api + "/payment/prepare",
  paymentProceed: HK.GLBLS.api + "/payment/proceed",
  cardDelete: HK.GLBLS.api + "/payment/card/delete",
  getCaptchaImg: HK.GLBLS.api + "/captcha/newCaptcha",
  verifyCaptchaImg: HK.GLBLS.api + "/captcha/verifyCaptcha"
};
HK.errs = {
  requestFail: 'Request Failed',
  enterEmail: 'Please enter email address',
  invalidEmail: 'Email address is not valid',
  enterPassword: 'Please enter password',
  enterName: 'Please enter your name',
  enterTitle: 'Please enter review title',
  enterReview: 'Please enter review description',
  enterRating: 'Please give rating to product',
  enterPhoneNumber: 'Please enter phone number',
  enterAddLine: 'Please enter address line 01',
  enterCity: 'Please enter city',
  enterState: 'Please enter state',
  invalidPincode: 'Please enter a valid pincode',
  invalidPhoneNumber: 'Please enter a valid no.',
  passwordNotMatch: 'Password and confirm password are not same',
  emailNotDifferent: 'New Email and Old Email must be different',
  passwordNotDifferent: 'New and Old Password must be different',
  enterMessage: 'Please enter your Message',
  emptyCoupon: 'Please enter a coupon code',
  validCoupon: 'Please enter a valid coupon code',
  enterGender: 'Please enter gender',
  invalidCharacters: 'Special characters not allowed',
  cartSyncMessage: 'Your page will be refreshed',
  invalidCardNumber: 'Invalid card number',
  invalidMonth: 'Invalid month',
  invalidYear: 'Invalid Year',
  invalidCvv: 'Invalid CVV',
  invalidNameOnCard: 'Invalid Name'
};
HK.timeOut = {
  xxs: 300,
  xs: 1000,
  small: 2000,
  medium: 5000,
  large: 10000,
  insane: 50000
};


/** Maintain objects needed across application Start **/
HK.dataObj = {};
/* method to generate an object of specified type
 Example:

 */
HK.dataObj.getObject = function (type) {
  if (HK.dataObj.hasOwnProperty(type)) {
    return HK.dataObj[type]()
  }
  return null
}
// a list of methods that are available
HK.dataObj.type = {
  UPDATE_CART: 'updateCart',
  VARIANT_DETAIL: 'variantDetail',
  CART_OFFER: 'cartOffer'
}
// generates object used in popup which is displayed when product is added to cart
HK.dataObj.updateCart = function () {

  function _UpdateCart() {
    this.cartValue = 0;
    this.noOfItems = 0;
    this.svName = '';
  }

  _UpdateCart.prototype.getCartValue = function () {
    return this.cartValue
  }
  _UpdateCart.prototype.setCartValue = function (cv) {
    this.cartValue = cv
  }
  _UpdateCart.prototype.getNoOfItems = function () {
    return this.noOfItems
  }
  _UpdateCart.prototype.setNoOfItems = function (noi) {
    this.noOfItems = noi
  }
  _UpdateCart.prototype.getSvName = function () {
    return this.svName
  }
  _UpdateCart.prototype.setSvName = function (name) {
    this.svName = name
  }
  return new _UpdateCart();
}

/**
 * HK notification for alert from top of screen
 * @param settings
 */
HK.alert = function(settings) {
    var _self = {};
    _self.root = null;
    _self.rootClass = 'notification-root';
    _self.contentClass = 'notice-content';
    _self.removeClass = "notice-remove";

    _self.getContentRef = function() {
        return _self.root.find('.' + _self.contentClass);
    }

    /* Function to create the notification unit
     * @Parameter: settings - configuration settings
     */
    _self.createNoticeBanner = function(settings) {

        //remove previous notification if any
        if(document.getElementsByClassName(_self.rootClass)[0]) {
            document.getElementsByClassName(_self.rootClass)[0].remove();
        }

        //new html elements
        var element, content, closeEle, target;

        // creating new dom elements
        element = $('<div></div>');
        content = $('<div></div>');
        closeEle = $('<div></div>');

        content.addClass(_self.contentClass);
        element.addClass(_self.rootClass);
        closeEle.addClass(_self.removeClass);

        element.append(content);
        element.append(closeEle);

        _self.root = element;

        // appending notification unit to body element
        $('body').append(element);
        _self.init(settings);
        _self.root.addClass("bringDown");

        return _self.root;
    }

    /* Function to configure the notification unit
     * @Parameter: settings - configuration settings
     */
    _self.init = function(settings) {
        var closeElements;

        _self.getContentRef().html(settings.content);

        if(settings.autoClose){
            _self.autoClose(settings.autoClose);
        }

        closeElements = _self.root.find('.' + _self.removeClass);
        $(closeElements).click(function() {
            _self.close();
        });
    }

    /* Function to auto close the notification unit
     * @Parameter: autoClose- autoClose time or choose default time.
     */
    _self.autoClose = function(autoClose) {
        var autoCloseTime = typeof(autoClose) == 'number' ? autoClose : 2000;
        setTimeout(function() {
            _self.close();
        },autoCloseTime);
    }

    /* Function to close and remove the notification unit */
    _self.close = function() {
        _self.root.remove();
    }
    _self.createNoticeBanner(settings);

};

HK.shadow = function () {
  var shdwPrnt = $('<div></div>');
  var shdw = $('<div></div>');
  var loader = $('<div></div>');
  var loaderText = $('<div>Loading...</div>');
  shdwPrnt.css({width: '100%', position: 'absolute', 'z-index': '1000', top: 0, display: 'none'});
  shdw.css({height: 'inherit', opacity: '0.5', alpha: '0.5', 'background-color': '#eee'});
  loader.css({position: 'fixed', top: '40%', right: '45%'}).addClass('icn-loader-large');
  loaderText.css({position: 'relative', top: '105%', right: '25%', 'font-size': '18px', 'font-weight': '600', color: 'rgb(0,144,190)'});

  shdwPrnt.append(shdw);
  loader.append(loaderText);
  shdwPrnt.append(loader);
//    shdwPrnt.append(loaderText);

  $('body').append(shdwPrnt);

  return {show: function () {
    shdwPrnt.css({'display': 'block', height: $('html').height()});
  },
    hide: function () {
      shdwPrnt.css('display', 'none');
    }
  }

}();

HK.msgs = {
  successRemove: 'Successfully Removed',
  successAdd: 'Successfully Added',
  upldFl: 'Upload File',
  ldng: 'Loading',
  added2Crt: 'Added to your cart',
  noProductFound: 'No product found',
  enterMessage: 'It would be great, if you just enter something to search for',
  offerApplied: 'Offer applied successfully',
  couponApplied: 'Coupon applied successfully',
  couponRemoved: 'Coupon removed successfully',
  submitFeedback: "Thank you for your feedback!"


};

HK.utils.Scroll.toElement = function (ele, speed) {//soft scroll to specified element
  var position = 0;
  try {
    position = $(ele).position().top;
  } catch (e) {
    //Un comment line below to see error on chrome, mozila, ie9 onwards
    //console.log(e)
  }
  this.toPosition(position, speed);
};

HK.utils.Scroll.toPosition = function (position, speed) {//soft scroll to specified position
  if (typeof speed != 'number') {
    speed = 300;
  }
  if (typeof position != 'number') {
    position = 0;
  }
  $('html,body').animate({scrollTop: position}, speed);
};



(function(){
  /**
   * function to toggle elements in a list
   */

  $('.js-toggle-child').click(function(e){
    var _self = $(this),
        child = _self.find('ul.list:first-child');
    $('.js-toggle-child').not(_self).find('ul.list:first-child').addClass('hide');
    if(child.hasClass('hide')){
      child.removeClass('hide')
    } else {
      child.addClass('hide')
    }
  })



}())

