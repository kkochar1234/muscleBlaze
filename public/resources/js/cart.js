$('.buy-now').click(function(e){
  e.preventDefault();

  var onSuccess = function (json) {

    if (json.exception) {

      alert("Product cannot be added to cart");
    } else {
      HK.alert({content:"<a href='/cart'>Product added to cart<br><span class='text-success btn btn-secondary'>Go to cart</span></a>"});
      /*var results = json.results;
      var updateCartData = HK.dataObj.getObject(HK.dataObj.type.UPDATE_CART);
      updateCartData.setCartValue(results.cartValue);
      updateCartData.setNoOfItems(results.noOfItems);
      updateCartData.setSvName(results.svName);
      HK.updateCartPop(updateCartData);
      if (scrollToTop) {
        var scrollTo = $('.cart-pop-container');
        if (scrollTo.position().top < $(document).scrollTop()) {
          HK.utils.Scroll.toElement(scrollTo);
        }
      }*/
    }
  };
  var onError = function (xhr, a_status) {
    alert("Product cannot be added to cart");
  };

  var variantId = $(this).attr('variant-id'),
      vendorId = $(this).attr('vendor-id'),
      url = '/cart/add';

  var params = {"storeVariantId": variantId, "vendorId": vendorId};

  HK.Ajax.customReq({url:url, type:"POST", data: JSON.stringify(params), success: onSuccess, error: onError});

})