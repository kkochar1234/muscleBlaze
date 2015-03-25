$('a.delete-address').click(function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  var target = $(this).attr('href');
  HK.confirm({
    title: "Delete saved address?",
    theme: HK.POPUP.THEME.ALERT,
    content: "Are you sure you want to delete this saved address",
    btnArr: [
      {
        text: 'Delete',
        callback: function () {
          location.href = target;
        },
        title: "Click button if you want to confirm your action"
      },
      {
        text: 'Cancel',
        callback: function () {
        },
        title: "Click this button if you do not want to delete the address"
      }
    ]
  });

})
//      $("input#cityName").attr("disabled",true);

//      $('[name=addAddressForUser]').click(function (event) {
//        var doSubmit = HK.Location().validateAddress();
//        if (doSubmit != true) {
//          event.preventDefault();
//        }
//      });
$('.edit-address').click(function (e) {
  e.preventDefault();
  e.stopPropagation();

  var currentAddCntnr = $(this).parents('.usr-add-cntnr').find('.usr-add');
  var addressid = currentAddCntnr.find('.adresss-id').text();
  var adresssUsrName = $.trim(currentAddCntnr.find('.adresss-usr-name').text());
  var adresssTxt = currentAddCntnr.find('.adresss-txt').text();
  adresssTxt = adresssTxt.replace(",", ""); //to avoid comma in the edit field
  var adresssLandmark = currentAddCntnr.find('.adresss-landmark').text();
  adresssLandmark = adresssLandmark.replace(",", ""); //to avoid comma in the edit field
  var addressCityId = currentAddCntnr.find('.address-cityId').text();
  var addressCityName = currentAddCntnr.find('.address-cityname').text();
  addressCityName = addressCityName.replace(",", ""); //to avoid comma in the edit field
  var addressState = currentAddCntnr.find('.address-state').text();
  var addressPincode = currentAddCntnr.find('.address-pincode').text();
  var addressMobile = currentAddCntnr.find('.address-mobile-no').text();
  var addressAlternateNo = currentAddCntnr.find('.address-alt-no').text();
  $('#addressId').val(addressid);
  $('#user-name').val(adresssUsrName);
  $('#contactNo').val(addressMobile);
  $('#alternateContactNo').val(addressAlternateNo);
  $('#line1').val(adresssTxt);
  $('#landmark').val(adresssLandmark);
  $('#city-id').val(addressCityId);
  $('#cityName').val(addressCityName);
  $("#cityName").attr("disabled", false);
  $('#state').val(addressState);
  $('#pincode').val(addressPincode);
  $('#addAddressForUser').attr("name", "updateAddressForUser");
  $(".new-add-sectn").fadeIn('slow');
  HK.utils.Scroll.toElement("#addNewAddress");

});

$('[name=stateId]').change(function (event) {
  var stateId = $(this).val();
  if (stateId != '') {
    $('#cityName').val('');
    $("#cityName").attr("disabled", false);
    HK.Location().initializeCityAutoComp(stateId);
  }
  else {
    $('#cityName').val('');
    $("#cityName").attr("disabled", true);
  }
});

try {
  $(".new-add-sectn input,.new-add-sectn select,.new-add-sectn textarea").focus(function () {
    HK.validator.hideErrMsg(this);
  });
} catch (e) {
}

$('#pincode').keyup(function () {
  if (($('#pincode').val()).length == 6) {
    var pincode = $(this).val();
    if (pincode != '') {
      function getCityState(responseData) {
        if (responseData.results.pin != null) {
          var cityId = responseData.results.pin.cityId;
          var cityName = responseData.results.pin.cityNm;
          var stateId = responseData.results.pin.stateId;
          var stateName = responseData.results.pin.stateNm;
          $('#state').val(stateId);
          $('#cityName').val(cityName);
          $("#cityName").attr("disabled", false);
          $('#city-id').val(cityId);
        }
      };
      HK.Location().getLocationDetails(pincode, getCityState);
    }
  }
  else {
    $('#state').val('');
    $('#cityName').val('');
  }
});


//      $('#pincode').blur(function () {
//        if (($("#pincode").val()).length == 0) {
//          $('#state').val('');
//          $('#cityName').val('');
//        }
//        var pincode = $(this).val();
//        if (pincode != '') {
//          function getCityState(responseData) {
//            if (responseData.results.pin != null) {
//              var cityId = responseData.results.pin.cityId;
//              var cityName = responseData.results.pin.cityNm;
//              var stateId = responseData.results.pin.stateId;
//              var stateName = responseData.results.pin.stateNm;
//              $('#state').val(stateId);
//              $('#cityName').val(cityName);
//              $("#cityName").attr("disabled", false);
//              $('#city-id').val(cityId);
//            }
//          };
//          HK.Location().getLocationDetails(pincode, getCityState);
//        }
//      });
$('.usr-add-cntnr').click(function (e) {
  //var selectedAddLink = $(this).children('.add-action-cntnr').children('.select-address');
  //var selectedAddLink = $(this).children('.add-action-cntnr').children('.select-address');
  var selectedAddLink = $(this).find('.select-address');

  location.href = selectedAddLink.attr('href');
});

$(".js-add-new").click(function () {
  $(".new-add-sectn").fadeIn('slow');
})