var winston = require('winston')

exports.info = function(message){
  winston.info(message)
}

exports.error = function(message){
  winston.error(message)
}