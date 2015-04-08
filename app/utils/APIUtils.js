//Utility to make calls to API server and prepare request for calls etc
//

var request = require('request'),
    _ = require('underscore'),
    appConfig = require('../appConfig'),
    logger = require('./loggingUtils'),
    requestConstants = require('../constants/rest/requestConstants'),
    appConstants = require('../constants/appConstants');

/**
 * makes http call to server and also handles
 * @param options - configuration and data for call
 * @param cb - callback method to be executed when response is received
 */
exports.httpRequest = function (options, cb) {
  var config = {
    url: appConfig.hkAPI.url,
    method: 'GET',
    json: true,
    form: null,
    rejectUnauthorized: false,
    followAllRedirects: true
    };

  _.extend(config, options)

  if(config.body) {
    config.body[requestConstants.PLATFORM_ID] = appConstants.PLATFORM_CONSTANTS.MOBILE;
  }

  logger.info("API Request hit: " + options.url)
  if(options.body){
    logger.info("API Request data: " + JSON.stringify(options.body))
  }

  request(config, function (err, resp, body) {

    //when no response from server, usually this happens when:
    // 1. The server IP is not correct
    // 2. The server is down
    if (err){
      logger.error(err)
      return cb({statusCode:500,message: err.message})
    }


    //case when we received response from server
    if (resp.statusCode == 200) {
      var respData;

      //checking if bofy is in JSON format or not
      //if it is not in json format, it is converted into one
      if (config.parseJSON && typeof body === 'string') {
        respData = JSON.parse(body)
      } else {
        respData = body
      }

      //check if response contains exception
      return  cb(null, respData)

    } else {
      switch (resp.statusCode) {
        case 404:
          logger.error("Page not found : "+ options.url)

          break;
        default:
          logger.error('Error in API call ' + options.url + " : " + resp.statusCode)
          logger.info("API Request : " + JSON.stringify(options, null, 2))
          return cb('Error in API response', {})
      }
    }
  });
}
