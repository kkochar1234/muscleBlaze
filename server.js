var express = require('express');




var app = express();


var config = require('./app/appConfig'),
    logger = require('./app/utils/loggingUtils')




// express settings
require('./config/express')(app, config)

require('./config/routes')(app)

require('./config/winston')(app, config)

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Page not found : '+ req.originalUrl);
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'dev') {
  app.use(function(err, req, res, next) {
    logger.error(err.stack)

    res.status(err.status || 500);
    res.render('error', {
      message: err.stack,
      error: err
    });

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.error(err.stack)

  res.status(err.status || 500);
  if(err.status >= 400 && err.status < 500){
    return res.render('404', {
      message: err.message,
      error: {}
    });
  } else {
    return res.render('500', {
      message: err.message,
      error: {}
    });
  }

});


app.listen(config.port,function(){
  console.log("started")
})

module.exports = app;
