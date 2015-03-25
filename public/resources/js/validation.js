/**
 * Created with IntelliJ IDEA.
 * User: Himanshu Jain
 * Date: 2/13/15
 * Time: 3:05 AM
 * To change this template use File | Settings | File Templates.
 */

(function () {
  /*---------------------REAL TIME FORM VALIDATION---------------------*/

  /*
   * Conventions
   *
   * a) form must contain a class "js-validate-form" so as to get validated
   *
   * b) for fields to be validated inside this form should contain attribute "data-validate"
   * with params as which validations are to be done
   * eg. data-validate="empty,specialChar,email,phone,number"
   *
   * note : the order of these params will define the order of execution for validating the respective field.
   *
   * c) each field to be validated should contain attribute "data-fieldType" which defines the field
   * type for showing concerned error message.
   *
   * d) submit button inside the form should contain class "js-validate-submit" which will validate all the
   * fields (that are to be validated) inside the form before actually submitting the data.
   *
   *
   * */


  /*primary object defining all the elements within the plugin*/
  var validator = {

    ele: {
      "form": "form.js-validate-form",
      "validateAttr": "data-validate",
      "fieldType": "data-fieldType",
      "submitButton": "input.js-validate-submit"
    },

    type: {
      "empty": "empty",
      "invalid": "invalid",
      "specialChar": "specialChar"
    },

    regex: {
      "email": /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
      "pincode": /^[0-9]{6}$/,
      "phone": /[\+0-9\-]+$/,
      "number": /^[0-9]+$/,
      "specialChar": /[<>]/i
    },

    errorMessage: {
      "empty_name": HK.errs.enterName,
      "empty_phone": HK.errs.enterPhoneNumber,
      "empty_address": HK.errs.enterAddLine,
      "empty_pincode": HK.errs.invalidPincode,
      "empty_state": HK.errs.enterState,
      "empty_city": HK.errs.enterCity,
      "empty_coupon": HK.errs.emptyCoupon,
      "empty_email": HK.errs.enterEmail,
      "invalid_phone": HK.errs.invalidPhoneNumber,
      "invalid_pincode": HK.errs.invalidPincode,
      "invalid_email": HK.errs.invalidEmail,
      "specialChar": HK.errs.invalidCharacters
    }

  };


  /*******Event bindings starts***************/
  $(validator.ele.form).on("blur", "[" + validator.ele.validateAttr + "]", function () {

    var $this = $(this);
    var validationParams = $this.attr(validator.ele.validateAttr).split(",");

    for (var i = 0; i < validationParams.length; i++) {
      if (validationParams[i] !== validator.type.empty) {
        if (!validate($this, validationParams[i])) {
          break;
        }
      }
    }

  });

  $(validator.ele.form).on("focus", "[" + validator.ele.validateAttr + "]", function () {
    displayErrorMessage(false, $(this));
  });

  $(validator.ele.form).on("click", validator.ele.submitButton, function (event) {

    var dosubmit = true;
    var $this = $(this);
    var parentForm = $this.closest(validator.ele.form);
    parentForm.find("[" + validator.ele.validateAttr + "]").each(function () {

      var ele = $(this);
      var validationParams = ele.attr(validator.ele.validateAttr).split(",");

      for (var i = 0; i < validationParams.length; i++) {
        if (!validate(ele, validationParams[i])) {
          dosubmit = false;
          break;
        }
      }
    });

    if (!dosubmit) {
      event.preventDefault();
    }
  });

  /*******Event bindings ends***************/


  /*main validation function which will return true or false as result
   *
   * note : only basic entities for validation are mentioned, and can be extended according to requirement
   *       i.e. more cases can be added as pr requirement.
   *
   * */
  function validate(context, param) {

    var returnValue = true,
        isNull = $.trim(context.val()).length <= 0,
        eleValue = $.trim(context.val());


    switch (param) {
      case "empty":
        if (isNull) {
          returnValue = false;
          displayErrorMessage(true, context, validator.type.empty);
        } else {
          displayErrorMessage(false, context);
        }
        break;

      case "number":
        if (!isNull) {
          if (!validator.regex.number.test(eleValue)) {
            returnValue = false;
            displayErrorMessage(true, context);
          } else {
            displayErrorMessage(false, context);
          }
        }
        break;

      case "email":
        if (!isNull) {
          if (!validator.regex.number.test(eleValue)) {
            returnValue = false;
            displayErrorMessage(true, context);
          } else {
            displayErrorMessage(false, context);
          }
        }
        break;

      case "phone":
        if (!isNull) {
          if (!validator.regex.phone.test(eleValue)) {
            returnValue = false;
            displayErrorMessage(true, context);
          } else {
            displayErrorMessage(false, context);
          }
        }
        break;

      case "pincode":
        if (!isNull) {
          if (!validator.regex.pincode.test(eleValue)) {
            returnValue = false;
            displayErrorMessage(true, context);
          } else {
            displayErrorMessage(false, context);
          }
        }
        break;

      case "specialChar":
        if (!isNull) {
          if (validator.regex.specialChar.test(eleValue)) {
            returnValue = false;
            displayErrorMessage(true, context, validator.type.specialChar);
          } else {
            displayErrorMessage(false, context);
          }
        }
        break;
    }

    return returnValue;
  }


  function displayErrorMessage(val, context, validationType) {

    var fieldType = context.attr(validator.ele.fieldType),
        errMsg,
        msgKey,
        errTxtMsg,
        errTxtMsg,
        hideMessage = function (ele) {
          $(ele).removeClass('err-brdr');
          $(ele).next('.err-txt').remove();
          $(ele).next('.icn-warning-small').remove();
        },
        showMessage = function (ele, msg) {
          if (!$(ele).hasClass('err-brdr')) {
            $(ele).addClass('err-brdr');
            $(ele).after(msg);
          }
        }

    if (val) {

      if (undefined === validationType) {
        validationType = validator.type.invalid;
      }

      msgKey = validationType + "_" + fieldType;

      if (validationType === validator.type.specialChar) {
        errMsg = validator.errorMessage.specialChar;
      } else {
        errMsg = validator.errorMessage[msgKey];
      }

      var errTxtMsg = $("<p class='err-txt'>" + errMsg + "</p>");
      hideMessage(context);
      showMessage(context, errTxtMsg);
    } else {
      hideMessage(context);
    }

  }


  /*---------------------REAL TIME FORM VALIDATION ENDS---------------------*/
}());
