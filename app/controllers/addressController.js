var addressService = require('../services/addressService'),
    linkManager = require('../utils/LinkManager')

exports.getAddressForUser = function(req, res) {

  function cb(err, data) {

    return res.cfaRender('address/address',err, {addressData : data.addressList, stateList: data.stateList},req,res);

  }

  addressService.getAddressForUser(req, cb)

}

exports.getPincodeDetails = function(req, res) {
  function cb(err, pincodeData) {

    res.cfaRender(null, err,pincodeData,req,res)

  }

  addressService.getPincodeDetails(req, cb);
}

exports.selectAddressForUser = function(req, res) {

  function cb(err, addressData) {
    if(err) {
      res.send(err.msg)
      return
    }
    res.redirect(linkManager.getPaymentPageUrl(addressData.results.mdfd_addrs_id))
  }

  addressService.selectAddressForUser(req, cb);

}

exports.deleteAddress = function(req, res) {

  function cb(err, resp) {
    return res.redirect(linkManager.getAddressPageUrl());
  }

  addressService.deleteAddressForUser(req, cb);

}