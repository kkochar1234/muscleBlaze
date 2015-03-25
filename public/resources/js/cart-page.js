/* Hack to control the order qty of NUT1367-22 / 61164 */
var quantityLimitVariant = 61164; //Prod
//var quantityLimitVariant = 50578; //Test
var quantityLimit = 1;

$('.offers-label').click(function () {
  $(this).parents('.offers-container').toggleClass('offers-displayed');
})
var getUnitPrice = function (price, quantity) {
  return Number((Number(price) / Number(quantity)).toFixed(2))
}

var updateCart = function (event, data) {
}

var prepareItemData = function (ele) {
  ele
}

$(HK.Cart.elm.cartItem).each(function () {
  var cartItem = $(this);
  var info = {
    upActual: getUnitPrice($(this).find(HK.Cart.elm.itemMrpPrice).text(), $(this).find(HK.Cart.elm.itemQuantity).val()),
    upOffered: getUnitPrice($(this).find(HK.Cart.elm.itemOfferPrice).text(), $(this).find(HK.Cart.elm.itemQuantity).val()),
    quantity: Number($(this).find(HK.Cart.elm.itemQuantity).val())
  }

  //patch for packs
  if ($(this).find(HK.Cart.elm.packQuantity).length == 1) {
    info.quantity = Number($(this).find(HK.Cart.elm.packQuantity).val());
  }
  cartItem.data(info);

  //validation events
  cartItem.find(HK.Cart.elm.itemQuantity).on('keypress', function (e) {
    if (!(e.which >= 48 && e.which <= 57) || cartItem.hasClass('disabled')) {
      e.preventDefault()
    }
  });

  //Events occuring when user change quantity of item, trigger events on item level
  cartItem.find(HK.Cart.elm.itemMinus).bind('click', function () {
    cartItem.trigger(HK.Cart.events.sub);
  });

  cartItem.find(HK.Cart.elm.packMinus).bind('click', function () {
    cartItem.trigger(HK.Cart.events.packSub);
  });

  cartItem.find(HK.Cart.elm.itemQuantity).bind('blur', function () {
    cartItem.trigger(HK.Cart.events.update);
  });

  cartItem.find(HK.Cart.elm.packQuantity).bind('blur', function () {
    cartItem.trigger(HK.Cart.events.packUpdate);
  });

  cartItem.find(HK.Cart.elm.itemPlus).bind('click', function () {
    cartItem.trigger(HK.Cart.events.add);
  });

  cartItem.find(HK.Cart.elm.packPlus).bind('click', function () {
    cartItem.trigger(HK.Cart.events.packAdd);
  });

  cartItem.find(HK.Cart.elm.itemRemove).bind('click', function () {
    cartItem.trigger(HK.Cart.events.remove);
  })

  cartItem.find(HK.Cart.elm.packRemove).bind('click', function () {
    cartItem.trigger(HK.Cart.events.packRemove);
  })

  //Handle events triggered as a response to user actions
  cartItem.on(HK.Cart.events.add, function () {
    var info = $.extend({}, cartItem.data());
    // Hack to check the qty
    if(info.id == quantityLimitVariant && info.quantity >= quantityLimit){
      cartItem.find(HK.Cart.elm.itemQuantity).val(quantityLimit);
      info.quantity = quantityLimit;
      return;
    }
    info.quantity = info.quantity + 1;

    if (!cartItem.hasClass('disabled')) {
      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.updateVariantInCart,
        data: JSON.stringify({variantId: info.id, qty: info.quantity}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {

          cartItem.trigger('updateConfirmed', [info, serverResponse]);
          cartItem.removeClass('disabled');
        },
        error: function (xhr) {
          cartItem.removeClass('disabled');
        }
      })
    }
  });

  //send increase quantity request to server for a pack
  cartItem.on(HK.Cart.events.packAdd, function () {
    var info = $.extend({}, cartItem.data());
    var parent = cartItem.parents('.packs');
    var sep = '';

    info.quantity = info.quantity + 1;
    info.packId = parent.data('id');
    info.storeVariantIdsInPackStr = '';
    parent.find(HK.Cart.elm.cartItem).each(function () {
      info.storeVariantIdsInPackStr += sep + $(this).data('id');
      sep = ',';
    });
    if (!cartItem.hasClass('disabled')) {
      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.updatePackInCart,
        data: JSON.stringify({packId: info.packId, qty: info.quantity, storeVariantIdsInPackStr: info.storeVariantIdsInPackStr}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {

          cartItem.trigger('updateConfirmed', [info, serverResponse]);
          cartItem.removeClass('disabled');
        },
        error: function (xhr) {
          cartItem.removeClass('disabled');
        }
      })
    }
  });

  cartItem.on(HK.Cart.events.update, function () {
    var info = $.extend({}, cartItem.data());
    var itmQtyNew = Number(cartItem.find(HK.Cart.elm.itemQuantity).val());


    if (isNaN(itmQtyNew) || itmQtyNew == 0) {
      cartItem.find(HK.Cart.elm.itemQuantity).val(info.quantity);
      return
    } else {
      // Hack to check the qty
      if(info.id == quantityLimitVariant && itmQtyNew > quantityLimit){
        itmQtyNew = quantityLimit;
        cartItem.find(HK.Cart.elm.itemQuantity).val(quantityLimit);
      }
      if (info.quantity != itmQtyNew) {
        info.quantity = itmQtyNew;
      } else {
        return
      }
    }

    if (!cartItem.hasClass('disabled')) {

      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.updateVariantInCart,
        data: JSON.stringify({variantId: info.id, qty: info.quantity}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {
          cartItem.removeClass('disabled');
          cartItem.trigger('updateConfirmed', [info, serverResponse]);
        },
        error: function (xhr) {
          cartItem.removeClass('disabled');
        }
      })
    }
  });

  cartItem.on(HK.Cart.events.packUpdate, function () {
    var info = $.extend({}, cartItem.data());
    var parent = cartItem.parents('.packs');
    var itmQtyNew = Number(cartItem.find(HK.Cart.elm.packQuantity).val());
    var sep = '';

    info.packId = parent.data('id');
    info.storeVariantIdsInPackStr = '';
    parent.find(HK.Cart.elm.cartItem).each(function () {
      info.storeVariantIdsInPackStr += sep + $(this).data('id');
      sep = ',';
    });

    if (isNaN(itmQtyNew) || itmQtyNew == 0) {
      cartItem.find(HK.Cart.elm.packQuantity).val(info.quantity);
      return
    } else {
      if (info.quantity != itmQtyNew) {
        info.quantity = itmQtyNew;
      } else {
        return
      }
    }

    if (!cartItem.hasClass('disabled')) {
      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.updatePackInCart,
        data: JSON.stringify({packId: info.packId, qty: info.quantity, storeVariantIdsInPackStr: info.storeVariantIdsInPackStr}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {
          cartItem.removeClass('disabled');
          cartItem.trigger('updateConfirmed', [info, serverResponse]);
        },
        error: function (xhr) {
          cartItem.removeClass('disabled');
        }
      })
    }
  })


  cartItem.on(HK.Cart.events.sub, function () {

    var info = $.extend({}, cartItem.data());
    if (!cartItem.hasClass('disabled')) {
      if (info.quantity > 1 && !cartItem.hasClass('disabled')) {
        info.quantity = info.quantity - 1;
        HK.Ajax.customReq({
          type: 'post',
          url: HK.urls.updateVariantInCart,
          data: JSON.stringify({variantId: info.id, qty: info.quantity}),
          beforeSend: function () {
            cartItem.addClass('disabled');
          },
          success: function (serverResponse) {
            cartItem.removeClass('disabled');
            cartItem.trigger('updateConfirmed', [info, serverResponse]);
          },
          error: function (xhr) {
            cartItem.removeClass('disabled');
          }
        })

      } else {
        //HK.alert({content: 'You must be out of your mind, how can you order something with quantity ZERO', theme: HK.POPUP.THEME.ALERT});
      }
    }
  });

  //send decrease quantity request to server for a pack
  cartItem.on(HK.Cart.events.packSub, function () {
    var info = $.extend({}, cartItem.data());
    var parent = cartItem.parents('.packs');
    var sep = '';
    if (info.quantity > 1 && !cartItem.hasClass('disabled')) {
      info.quantity = info.quantity - 1;
      info.packId = parent.data('id');
      info.storeVariantIdsInPackStr = '';
      parent.find(HK.Cart.elm.cartItem).each(function () {
        info.storeVariantIdsInPackStr += sep + $(this).data('id');
        sep = ',';
      });

      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.updatePackInCart,
        data: JSON.stringify({packId: info.packId, qty: info.quantity, storeVariantIdsInPackStr: info.storeVariantIdsInPackStr}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {

          cartItem.trigger('updateConfirmed', [info, serverResponse]);
          cartItem.removeClass('disabled');
        },
        error: function (xhr) {
          cartItem.removeClass('disabled');
        }
      });
    } else {
      //HK.alert({content: 'You must be out of your mind, how can you order something with quantity ZERO', theme: HK.POPUP.THEME.ALERT});
    }
  })

  cartItem.on(HK.Cart.events.remove, function () {

    var info = $.extend({}, cartItem.data());
    if (!cartItem.hasClass('disabled')) {


      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.removeFromCart,
        data: JSON.stringify({storeVariantsToRemove: [info.id]}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {
          checkLastItemOnRemove((serverResponse.results.cartPricing.cartVar).length,(serverResponse.results.cartPricing.cartPacks).length);


          cartItem.trigger('updateConfirmed', [info, serverResponse]);
          cartItem.next('hr').fadeOut().remove();
          cartItem.fadeOut().remove();



        },
        error: function (xhr) {
          HK.alert({title: HK.titles.wow, content: HK.errs.requestFail, theme: HK.POPUP.THEME.ALERT});
          cartItem.removeClass('disabled');
        }
      })

    } else {
      //HK.alert({content:'You must be out of your mind, how can you order something with quantity ZERO',theme:HK.POPUP.THEME.ALERT});
    }

  });

  //remove a pack from cart
  cartItem.on(HK.Cart.events.packRemove, function () {

    var info = $.extend({}, cartItem.data());
    var parent = cartItem.parents('.packs');
    var sep = '';
    info.packKey = parent.data('packkey');
    if (!cartItem.hasClass('disabled')) {
      HK.Ajax.customReq({
        type: 'post',
        url: HK.urls.removePackFromCart,
        data: JSON.stringify({packSrcEntityIdToRemoveSet: [info.packKey]}),
        beforeSend: function () {
          cartItem.addClass('disabled');
        },
        success: function (serverResponse) {

          checkLastItemOnRemove((serverResponse.results.cartPricing.cartVar).length,(serverResponse.results.cartPricing.cartPacks).length);

          cartItem.trigger('updateConfirmed', [info, serverResponse]);
          parent.fadeOut().remove();
        },
        error: function (xhr) {
          HK.alert({title: HK.titles.wow, content: HK.errs.requestFail, theme: HK.POPUP.THEME.ALERT});
          cartItem.removeClass('disabled');
        }
      })

    } else {
      //HK.alert({content:'You must be out of your mind, how can you order something with quantity ZERO',theme:HK.POPUP.THEME.ALERT});
    }

  });

  cartItem.on('updateConfirmed', function (event, data, serverResponse) {

    if (serverResponse.exception) {

    } else {

      var cartSummaryData = serverResponse;

      //cartSummaryData.quantity = data.quantity - cartSummaryData.quantity;
      var itms = cartSummaryData.results.cartPricing.cartVar;
      var packs = cartSummaryData.results.cartPricing.cartPacks;

      if (typeof data.packId != "undefined") {
        $.each(packs, function () {
          var pack = this;
          var packVariants = pack.packVariants;
          var packCartItems = cartItem.parents('.packs:first');
          if (this['packId'] == data.packId) {
            data.quantity = pack.packQty;
            cartItem.find(HK.Cart.elm.packQuantity).val(data.quantity);
            cartItem.find(HK.Cart.elm.packOfferPrice).text(pack.packTotalOfferPrice.toFixed(2));
            cartItem.find(HK.Cart.elm.packMrpPrice).text(pack.packTotalMrp.toFixed(2));

            //to update quantity of product if more than one in a pack
            $.each(packVariants, function(){

              var packVariant = this,
                  dataId = packVariant.storeVariantId;

              packCartItems.find('.line-item'+"[data-id="+dataId+"]").find(HK.Cart.elm.packItemQuantity).text(packVariant.qty);
            });

            cartItem.data(data);
          }
        });
      } else {
        $.each(itms, function () {
          var itm = this, i;

          function updateFreebieQty(cartItem, freebieData){
            var freebieId = freebieData.freebieId,
                qty = freebieData.qty;

            cartItem.find(HK.Cart.elm.variantFreebieItem).filter('[data-freebie-id='+freebieId+']').find(HK.Cart.elm.variantFreebieQty).text(qty);
          }
          if (this['sv_id'] == data.id) {

            data.quantity = itm.qty;
            cartItem.find(HK.Cart.elm.itemQuantity).val(data.quantity);
            cartItem.find(HK.Cart.elm.itemOfferPrice).text(itm.totOffPr.toFixed(2));
            cartItem.find(HK.Cart.elm.itemMrpPrice).text(itm.totMrp.toFixed(2));
            if(itm.vrnt_freebies.length > 0){
              for(i=0; i<itm.vrnt_freebies.length; i++){
                updateFreebieQty( cartItem, itm.vrnt_freebies[i] );
              }

              //TODO: show freebie qty here against every freebie of a variant.
            }
            cartItem.data(data);

          }
        });
      }


      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, cartSummaryData);

    }
  });

  //	find('[data-role]').bind('click',function(){})
});

$(HK.Cart.elm.cartSummary).on(HK.Cart.events.update, function (event, serverResponse) {
  var scrollTo = $('.ttl-cntnr');
  var data = serverResponse.results.cartPricing;
  var cartSummary = $(this);
  var couponMsg = serverResponse.results.msgs;
  var couponException = serverResponse.results.exception;

  if (couponException == true) {
    $('.couponStatus[data-role=success]').addClass('hide');
    $('.couponStatus[data-role=fail] [data-role=message]').html(couponMsg);
    $('.couponStatus[data-role=fail]').removeClass('hide');
    return false;
  }

  var totalMrpPriceChange = data.totMrp.toFixed(2);
  var totalOfferPriceChange = data.totOffPr.toFixed(2);
  var totalPayable = data.totPay.toFixed(2);
  var promoDiscount = data.promoDisc.toFixed(2);
  var cartFreebies = data.cartFreebies;
  var appliedOffer = data.appOffId;
  var appliedCouponCode = data.appliedCouponCode;
  var appliedCouponTerms;
  if(data.appOfrDtl != null){
    appliedCouponTerms = data.appOfrDtl.terms;
  }

  var availedCashBack = data.cashBackAvail.toFixed(2);
  var rewardPointsUsed = data.rwd_pnts_usd;
  var totalDiscount = data.storeDisc.toFixed(2);

  var availableRewardPoints = Math.round($("[data-role=reward-points-lft]:first").text() - rewardPointsUsed).toFixed(2);


  if (totalPayable > 0 && rewardPointsUsed != 0 && availableRewardPoints != 0) {
    $('.js-rwrd-pts-rmng span[data-role=reward-points-rmng]').text(availableRewardPoints);
    $('.js-rwrd-pts-rmng').removeClass('hide');
  }
  else {
    $('.js-rwrd-pts-rmng').addClass('hide');
  }

  var shippingCharges = (data.totShip > 0) ? data.totShip : 'FREE';
//  var tmp = cartSummary.find(HK.Cart.elm.totalMrpPrice);
//  var top = cartSummary.find(HK.Cart.elm.totalOfferPrice);
//  var ts = cartSummary.find(HK.Cart.elm.totalSave);
//  var sc = cartSummary.find(HK.Cart.elm.shippingCharges);
//  var pd = cartSummary.find(HK.Cart.elm.promoDiscount);
//  var cb = cartSummary.find(HK.Cart.elm.cashBack);
//  var td = cartSummary.find(HK.Cart.elm.totalDiscount);

  var tmp = $(HK.Cart.elm.totalMrpPrice);
  var top = $(HK.Cart.elm.totalOfferPrice);
  var ts = $(HK.Cart.elm.totalSave);
  var sc = $(HK.Cart.elm.shippingCharges);
  var pd = $(HK.Cart.elm.promoDiscount);
  var cb = $(HK.Cart.elm.cashBack);
  var td = $(HK.Cart.elm.totalDiscount);


  tmp.text(totalMrpPriceChange);
  top.text(totalOfferPriceChange);
  ts.text(totalMrpPriceChange - totalOfferPriceChange);
  pd.text(promoDiscount);
  cb.text(availedCashBack);
  sc.text(shippingCharges);
  td.text(Number(totalDiscount) + Number(promoDiscount));

  availedCashBack > 0 ? $('.js-cashbck-cntnr').removeClass('hide') : $('.js-cashbck-cntnr').addClass('hide');

  var orderFreebieTemplateHtml = $('#orderFreebieTemplate').html();
  var orderFreebieTemplate = Handlebars.compile(orderFreebieTemplateHtml);


  /*cart freebies */
  $('.js-order-freebie').html(' ');
  $('[data-role=item-order-freebie]').remove();
  if (cartFreebies.length != 0) {
    for (var i = 0, len = cartFreebies.length; i < len; i++) {

      var content = orderFreebieTemplate(cartFreebies[i]);
      $('.js-order-freebie').append(content);
    }
  }
  /*ends*/

  /*reward points*/

  if (rewardPointsUsed > 0) {
    $('[data-role=reward-points-applied]').text(rewardPointsUsed);
    $('.js-rwrd-pts-lft').addClass('hide');
    $('.js-rwrd-pts-applied').removeClass('hide');
  }
  else {
    $('.js-rwrd-pts-lft').removeClass('hide');
    $('.js-rwrd-pts-applied').addClass('hide');
  }

  if (couponException != true && appliedCouponCode !== null && appliedOffer != null) {
    $('.remove-cpn').removeClass('hide');
    $('.js-cpn-applied').html(appliedCouponCode);
    $('.remove-coupon').data('id', appliedCouponCode);
    $('.add-cpn').addClass('hide');
    $('.couponStatus[data-role=success] [data-role=message]').html(appliedCouponCode != null ? appliedCouponCode + ': ' + HK.msgs.couponApplied : '' + HK.msgs.offerApplied).removeClass('hide');

    if(appliedCouponTerms !== null && appliedCouponTerms !== undefined){
      $('.couponStatus[data-role=success] [data-role=coupon-terms]').html("T&C : "+appliedCouponTerms).removeClass('hide');
    } else {
      $('.couponStatus[data-role=success] [data-role=coupon-terms]').html("").addClass('hide');
    }


    $('.couponStatus[data-role=fail]').addClass('hide');
    $('.couponStatus[data-role=success]').removeClass('hide');
    //HK.utils.Scroll.toElement(scrollTo);

  }
  else if (couponException != true && appliedOffer != null && appliedCouponCode == null) {  //condition to check prompt offer
    $('.remove-cpn').addClass('hide');
    $('.add-cpn').removeClass('hide');
    $('.couponStatus[data-role=success] [data-role=message]').html(appliedCouponCode != null ? appliedCouponCode + ': ' + HK.msgs.couponApplied : '' + HK.msgs.offerApplied).removeClass('hide');
    $('.couponStatus[data-role=fail]').addClass('hide');
    $('.couponStatus[data-role=success]').removeClass('hide');
    //HK.utils.Scroll.toElement(scrollTo);

  }
  else {
    $('.remove-cpn').addClass('hide');
    $('[data-role=item-order-freebie]').remove();
    $('.add-cpn').removeClass('hide');
    $('.couponStatus[data-role=success] [data-role=message]').addClass('hide');
    $('.couponStatus[data-role=fail]').addClass('hide');
    $('.couponStatus[data-role=success]').addClass('hide');
  }
  $(HK.Cart.elm.totalPayable).text(totalPayable);
//  cartSummary.find(HK.Cart.elm.totalSave).text(Number(tmp.text()) - Number(top.text()));
  $(HK.Cart.elm.totalSave).text(Number(tmp.text()) - Number(top.text()));

  var cartUpdate = new HK.dataObj.getObject(HK.dataObj.type.UPDATE_CART);
  cartUpdate.setCartValue(totalPayable);
  cartUpdate.setNoOfItems(data.cartVar.length + data.cartPacks.length);

  if ((data.cartVar.length + data.cartPacks.length) == 0) {
    $('.cart-cntnr').html('');
    location.href = location.href;
  }

  $(HK.Cart.elm.cartOffer).trigger(HK.Cart.events.offerUpdate, serverResponse.results.cartPricing);
});

$(HK.Cart.elm.cartOffer).on(HK.Cart.events.offerUpdate, function (e, cartPricing) {
  var offerTemplateHTML1 = $('#promptOfferTemplate').html();
  var offerTemplate1 = Handlebars.compile(offerTemplateHTML1);
  $('.js-offer-list').html('');
  cartPricing.cartOffers = cartPricing.cartOffers ? cartPricing.cartOffers : [];
  if ( cartPricing.cartOffers != null && cartPricing.cartOffers.length > 0) {
    $(HK.Cart.elm.cartOffer).removeClass('hide');
    $('.js-offer-list').removeClass('hide');
    $(this).find('p').removeClass('hide');
  } else {
    $(HK.Cart.elm.cartOffer).addClass('hide');
    $('.js-offer-list').addClass('hide');
    $(this).find('p').addClass('hide');
  }

  //update counter for offer applied
  $('[data-role=prompt-count]').text(cartPricing.cartOffers ? cartPricing.cartOffers.length : 0);

  $.each(cartPricing.cartOffers, function (i) {
    var cartOffers = this;


    if (cartPricing.appOffId === this.id) {
      cartOffers.applied = true;
    }
    var html1 = offerTemplate1(cartOffers);
    $('.js-offer-list').append(html1);

  });
});
/*Apply offer */


$('.offers-container, .prompt-offers-cnt').on('click', '.js-offer-item', function (e) {
//  $('.js-offer-').on('click', '.js-offer-item', function (e) {
  $(this).closest("div").find(".apply-offer").trigger("change");
});


$('.offers-container, .prompt-offers-cnt').on('change', '.apply-offer', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var offerId = currEle.attr('data-id');
  var url = HK.urls.applyOffer;

  var url = HK.urls.applyOffer + '/' + offerId;
  HK.shadow.show();
  // HK.element.loader.add(currEle, true);

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
      HK.alert({ content: json.results});
    } else {
      var results = json.results;
      var updateCartData = HK.dataObj.getObject(HK.dataObj.type.UPDATE_CART);

      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);

    }
  };
  var onError = function (xhr, a_status) {
    //HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url:url, success : onSuccess, error:onError});
});

/*remove offer */
$('.offers-container, .prompt-offers-cnt').on('click', '.remove-offer', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var offerId = currEle.attr('data-id');
  /*var url = HK.urls.removeOffer + '/' + offerId;*/
  var url = HK.urls.removeOffer;

  //HK.element.loader.add(currEle, true);
  HK.shadow.show();

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
        HK.alert({ content: json.results});
    } else {
      var results = json.results;
      var updateCartData = HK.dataObj.getObject(HK.dataObj.type.UPDATE_CART);

      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);

    }
  };
  var onError = function (xhr, a_status) {
    //HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url:url, success:onSuccess, error:onError});
});


/*reward redeem points*/


$('.js-rwrd-pts-lft, .js-rwrd-pts-applied').on('click', '.js-redeem-pt, .js-remove-pt', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var redeemPts =  Math.round($('[data-role=reward-points-lft]:first').text()), totalPayable = Math.round($('.js-tot-price:first').text());
  if (redeemPts > totalPayable && currEle.hasClass('js-redeem-pt')) {
    redeemPts = totalPayable
  }
  else if (currEle.hasClass('js-remove-pt')) {
    redeemPts = 0;
  }

  var url = HK.urls.redeemPts + '/' + redeemPts;
  HK.shadow.show();
  // HK.element.loader.add(currEle, true);

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
        HK.alert({ content: json.results});
    } else {

      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);

    }
  };
  var onError = function (xhr, a_status) {
    //HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url:url, success:onSuccess, error:onError});
});


//redeem remaining points
$('.js-rwrd-pts-rmng').on('click', '.js-redeem-rmng-pt', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var redeemPts = parseInt($('[data-role=reward-points-rmng]:first').text()), totalPayable = parseInt(Math.round($('.js-tot-price:first').text()));

  var usedRewardPoints = parseInt($('[data-role=reward-points-applied]:first').text());

  if (redeemPts > totalPayable && currEle.hasClass('js-redeem-rmng-pt')) {
    redeemPts = totalPayable + usedRewardPoints
//    redeemPts = redeemPts + usedRewardPoints;
  }
  else {
    if (usedRewardPoints != 0) {
      redeemPts = redeemPts + usedRewardPoints;
    }
  }

//  else if (currEle.hasClass('js-remove-pt')) {
//    redeemPts = 0;
//  }

  var url = HK.urls.redeemPts + '/' + redeemPts;
  HK.shadow.show();
  // HK.element.loader.add(currEle, true);

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
        HK.alert({ content: json.results});
    } else {
      var results = json.results;
      var updateCartData = HK.dataObj.getObject(HK.dataObj.type.UPDATE_CART);

      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);

    }
  };
  var onError = function (xhr, a_status) {
    //HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url:url, success:onSuccess, error:onError});
});


/*reward points ends*/


$('.apply-coupon').on('click', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var couponCode = $.trim($('[name=couponCode]').val());
  if (couponCode === undefined || couponCode == '' || couponCode == null) {
    $('.couponStatus[data-role=fail] [data-role=message]').html(HK.errs.emptyCoupon);
    $('.couponStatus[data-role=success]').addClass('hide');
    $('.couponStatus[data-role=fail]').removeClass('hide');
    return false;
  }

  var url = HK.urls.applyCoupon + '/' + couponCode;
  HK.shadow.show();
  // HK.element.loader.add(currEle, true);

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
        HK.alert({ content: json.results});
    } else {
      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);


    }
  };
  var onError = function (xhr, a_status) {
    // HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url: url, success: onSuccess, error: onError});
});


$('.remove-coupon').on('click', function (e) {
  e.preventDefault();
  var currEle = $(this);
  var url = HK.urls.removeOffer;
  HK.shadow.show();
  //HK.element.loader.add(currEle, true);

  var onSuccess = function (json) {
    HK.shadow.hide();
    //HK.element.loader.remove(currEle, true);
    if (json.exception) {
        HK.alert({ content: json.results});
    } else {
      $(HK.Cart.elm.cartSummary).trigger(HK.Cart.events.update, json);


    }
  };
  var onError = function (xhr, a_status) {
    //HK.element.loader.remove(currEle, true);
    HK.shadow.hide();
  };

  HK.Ajax.customReq({url:url, success:onSuccess, error:onError});
});

$(window).load(function () {

  var ptsInCart = $('.js-rwrd-pts-lft').data('rwrd-pts-used'),
      totalPayable = Math.round($('.js-tot-price:first').text()),
      userRewardPoints = $("[data-role=reward-points-lft]:first").text(),
      availableRewardPoints = (userRewardPoints - ptsInCart);

  if (ptsInCart > 0) {

    if (totalPayable >= 1 && availableRewardPoints >= 1) {
      $('.js-rwrd-pts-rmng span[data-role=reward-points-rmng]').text(Math.round(availableRewardPoints));
      $('.js-rwrd-pts-rmng').removeClass('hide');
    }

    $('.js-rwrd-pts-lft').addClass('hide');
    $('.js-rwrd-pts-applied').removeClass('hide');

  }
  else
  {
    $('.js-rwrd-pts-lft').removeClass('hide');
    $('.js-rwrd-pts-applied ').addClass('hide');
  }

  $(".js-coupon-code").keypress(function(event)
  {
    if(event.which == 13)
    {
      $(".apply-coupon").trigger("click");
    }
  });


});
if ($('#js-trim-cont').length > 0) {
  ShowHide('js-trim-cont', '0');
}
$('.trimmed-vrnt-cont .icn-close2, .js-cntinue').click(function (e) {
  $('.trimmed-vrnt-cont').addClass('hide');
  $('#overlayDIV').addClass('hide');
});


var checkLastItemOnRemove = function(respVarLength,respPackLength){

  var varLength = $(".cart-prdct-tbl .line-item").length,
      packLength = $(".cart-prdct-tbl .packs").length,
      currentItemsLength, respItemLength;

  currentItemsLength = Number(varLength) + Number(packLength);
  respItemLength = Number(respVarLength) + Number(respPackLength);

  if(currentItemsLength <= respItemLength)
  {
    HK.alert({content: 'Error'});
    setTimeout(function(){
      location.href = location.href;
    },1000);

  }

}

// Hack to check the qty
$.each($(HK.Cart.elm.cartItem),function(){
  if($(this).data().id == quantityLimitVariant && $(this).data().quantity > quantityLimit){
    $(this).trigger(HK.Cart.events.update);
  }
})