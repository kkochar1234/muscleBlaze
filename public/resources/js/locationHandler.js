/**
 * Created with IntelliJ IDEA.
 * User: Himanshu Jain
 * Date: 2/13/15
 * Time: 1:53 AM
 * To change this template use File | Settings | File Templates.
 */

if (typeof(HK) == 'undefined') {
  HK = {};
}

$('#pincode').keyup(function () {
  if (($('#pincode').val()).length == 6) {
    var pincode = $(this).val();
    if (pincode != '') {
      function getCityState(responseData) {
        if (responseData != null) {
          var cityId = responseData.cityId;
          var cityName = responseData.cityNm;
          var stateId = responseData.stateId;
          var stateName = responseData.stateNm;
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


/**--------------------------------------AUTO COMPLETER STARTS--------------------------------------------------------------**/
// Comment : This code is here for address page only.
/*
 * el: target element for autocomplete
 * dataUrl: url resource that will return json data
 * onSuccess: method to be called on successfully receiving json data
 * onSelect: method to be called on the select event
 * minLength: minimum length on which autocomplete shall be triggered
 */
HK.AutoCompleter = function () {
  return {
    autocomplete: function (el, dataUrl, onSuccess, onSelect, minlength, items) {
      var itemsList = new Array();
      var NoResultsLabel = "No Results";
      el.autocomplete({
        source: function (request, response) {
          $.ajax({
            url: dataUrl,
            dataType: "json",
            data: {
              q: request.term,
              noRs: items > 0 ? items : 10
            },
            success: function (responseData) {
              var autoId = el.parent('.autoParent').find('.autoId');
              itemsList = onSuccess.call(this, responseData, autoId);

              if (!itemsList.length) {
                itemsList = [NoResultsLabel];
              }
              response(itemsList);
            }
          });
        },
        minLength: minlength,
        delay: 300,
        select: function (event, ui) {
          if (onSelect != null) {
            onSelect.call(this, ui);
          }
        }
      });
    }
  }
};

HK.AutoCompleterStatic = function () {
  return {
    autocomplete: function (el, dataUrl, onSuccess, onSelect, minlength) {
      var itemsList = new Array();
      var NoResultsLabel = "No Results";

      $.ajax({
        url: dataUrl,
        dataType: "json",
        success: function (responseData) {
          var autoId = el.parent('.autoParent').find('.autoId');
          itemsList = onSuccess.call(this, responseData, autoId);
        },
        async: false
      });

      el.autocomplete({
        source: function (request, response) {
          var results = $.ui.autocomplete.filter(itemsList, request.term);

          if (!results.length) {
            results = [NoResultsLabel];
          }

          response(results);
        },
        minLength: minlength,
        select: function (event, ui) {
          if (ui.item.label === NoResultsLabel) {
            event.preventDefault();
          }
          if (onSelect != null) {
            onSelect.call(this, ui);
          }
        },
        focus: function (event, ui) {
          if (ui.item.label === NoResultsLabel) {
            event.preventDefault();
          }
        }
      });
    }
  }
};

/**--------------------------------------AUTO COMPLETER ENDS--------------------------------------------------------------**/


HK.Location = function () {
  return{
    /*initializePlaceAutoComp: function (cityId) {
     var autoElem = $('input:text#placeName');
     var autoMinLen = 2;

     var onPlaceAutoCompleteSuccess = function (responseData) {
     return $.map(responseData.results.places, function (item) {
     return{
     label: item.nm,
     value: item.nm,
     placeId: item.id,
     pincode: item.pin.pin
     };
     });
     };

     var onPlaceAutoCompleteSelect = function (ui) {
     if (ui.item) {
     $('input:hidden#place-id').val(ui.item.placeId);
     $('input:text#pincode').val(ui.item.pincode);
     }
     };

     HK.AutoCompleterStatic().autocomplete(
     autoElem,
     HK.urls.locationApi + "/" + cityId + "/places/",
     onPlaceAutoCompleteSuccess,
     onPlaceAutoCompleteSelect,
     autoMinLen
     );
     },*/

    initializeCityAutoComp: function (stateId) {
      var autoElem = $('input:text#cityName');
      var autoMinLen = 2;

      var onCityAutoCompleteSuccess = function (responseData) {
        return $.map(responseData.results.cities, function (item) {
          return{
            label: item.nm,
            value: item.nm,
            cityId: item.id
          };
        });
      };

      var onCityAutoCompleteSelect = function (ui) {
        if (ui.item) {
          var cityId = ui.item.cityId;
          $('input:hidden#city-id').val(cityId);
          //          HK.Location().initializePlaceAutoComp(cityId);
        }
      };

      HK.AutoCompleterStatic().autocomplete(
          autoElem,
          HK.urls.locationApi + "/state/" + stateId + "/cities/",
          onCityAutoCompleteSuccess,
          onCityAutoCompleteSelect,
          autoMinLen
      );
    },

    initializeStateAutoComp: function (countryId) {
      var autoElem = $('input:text#state');
      var autoMinLen = 2;

      var onStateAutoCompleteSuccess = function (responseData) {
        return $.map(responseData.results.states, function (item) {
          return{
            label: item.nm,
            value: item.nm,
            stateId: item.id
          };
        });
      };

      var onStateAutoCompleteSelect = function (ui) {
        if (ui.item) {
          var stateId = ui.item.stateId;
          $('input:hidden#state-id').val(stateId);
          HK.Location().initializeCityAutoComp(stateId);
        }
      };

      HK.AutoCompleterStatic().autocomplete(
          autoElem,
          HK.urls.locationApi + "/" + countryId + "/states/",
          onStateAutoCompleteSuccess,
          onStateAutoCompleteSelect,
          autoMinLen
      );
    },

    initializeCountryAutoComp: function () {
      var autoElem = $('input:text#country');
      var autoMinLen = 2;

      var onStateAutoCompleteSuccess = function (responseData) {
        return $.map(responseData.results.countries, function (item) {
          return{
            label: item.nm,
            value: item.nm,
            countryId: item.id
          };
        });
      };

      var onStateAutoCompleteSelect = function (ui) {
        if (ui.item) {
          var countryId = ui.item.countryId;
          $('input:hidden#country-id').val(countryId);
          HK.Location().initializeStateAutoComp(countryId);
        }
      };

      HK.AutoCompleterStatic().autocomplete(
          autoElem,
          HK.urls.locationApi + "/countries/",
          onStateAutoCompleteSuccess,
          onStateAutoCompleteSelect,
          autoMinLen
      );
    },

    getLocationDetails: function (pincode, callback) {
      var onSuccess = function (responseData) {
        callback(responseData);
      };

      var onError = function () {
        // do something if required..!
      };
      HK.Ajax.customReq({
        url: HK.urls.locationApi + "/pincode/" + pincode + "/details",
        success: onSuccess,
        error: onError
      });

    },

    validateAddress: function () {
      var doSubmit = true;
      if (HK.validator.isNull('[name=name]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=name]');
        HK.validator.showErrMsg('[name=name]', HK.errs.enterName);
      }
      else if(HK.validator.specialChar('[name=name]')){
        doSubmit = false;
        HK.validator.hideErrMsg('[name=name]');
        HK.validator.showErrMsg('[name=name]', HK.errs.invalidCharacters);
      }
      else {
        HK.validator.hideErrMsg('[name=name]');
      }
      if (HK.validator.isNull('[name=contactNo]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=contactNo]');
        HK.validator.showErrMsg('[name=contactNo]', HK.errs.enterPhoneNumber);

      }
      else if (!HK.validator.isPhoneNumber('[name=contactNo]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=contactNo]');
        HK.validator.showErrMsg('[name=contactNo]', HK.errs.invalidPhoneNumber);
      }
      else {
        HK.validator.hideErrMsg('[name=contactNo]');
      }

      if (!HK.validator.isNull('[name=alternateContactNo]')) {
        if (!HK.validator.isPhoneNumber('[name=alternateContactNo]')) {
          doSubmit = false;
          HK.validator.hideErrMsg('[name=alternateContactNo]');
          HK.validator.showErrMsg('[name=alternateContactNo]', HK.errs.invalidPhoneNumber);
        }
        else {
          HK.validator.hideErrMsg('[name=alternateContactNo]');

        }
      }else{
        HK.validator.hideErrMsg('[name=alternateContactNo]');
      }
      if (HK.validator.isNull('[name=line1]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=line1]');
        HK.validator.showErrMsg('[name=line1]', HK.errs.enterAddLine);
      }
      else if(HK.validator.specialChar('[name=line1]')){
        doSubmit = false;
        HK.validator.hideErrMsg('[name=line1]');
        HK.validator.showErrMsg('[name=line1]', HK.errs.invalidCharacters);
      }
      else {
        HK.validator.hideErrMsg('[name=line1]');
      }

      if (HK.validator.isNull('[name=pincode]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=pincode]');
        HK.validator.showErrMsg('[name=pincode]', HK.errs.invalidPincode);
      }
      else if (!HK.validator.isNumber('[name=pincode]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=pincode]');
        HK.validator.showErrMsg('[name=pincode]', HK.errs.invalidPincode);
      }
      else {
        HK.validator.hideErrMsg('[name=pincode]');
      }

      if (HK.validator.specialChar('[name=landmark]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=landmark]');
        HK.validator.showErrMsg('[name=landmark]', HK.errs.invalidCharacters);
      }
      else {
        HK.validator.hideErrMsg('[name=landmark]');
      }

      if (HK.validator.isNull('[name=stateId]')) {
        doSubmit = false;
        HK.validator.hideErrMsg('[name=stateId]');
        HK.validator.showErrMsg('[name=stateId]', HK.errs.enterState);
      }
      else {
        HK.validator.hideErrMsg('[name=stateId]');
      }
      if (HK.validator.isNull('[name=cityName]')) {
        doSubmit = false;
        HK.validator.showErrMsg('[name=cityName]', HK.errs.enterCity);
      }
      else if(HK.validator.specialChar('[name=cityName]')){
        doSubmit = false;
        HK.validator.hideErrMsg('[name=cityName]');
        HK.validator.showErrMsg('[name=cityName]', HK.errs.invalidCharacters);
      }
      else {
        HK.validator.hideErrMsg('[name=cityName]');
      }


      return doSubmit;

    }
  };
};