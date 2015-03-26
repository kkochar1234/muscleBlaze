var cookieParser = require('cookie-parser');
  bodyParser = require('body-parser'),
    path = require('path'),
    favicon = require('serve-favicon'),
    express = require('express'),
      sessions = require("client-sessions"),
      flash = require('connect-flash'),
      pageConstants = require('../app/constants/pageInfoConstants')


module.exports = function (app, config) {

  // uncomment after placing your favicon in /public
app.use(favicon(config.root + '/dist/public/resources/favicon.ico'));

  if(process.env.NODE_ENV == 'dev'){
    app.locals.pretty = true;
  }
  app.locals.ENV = process.env.NODE_ENV;
  app.locals.linkManager = require('../app/utils/LinkManager')
  app.locals.moment = require('moment')
  app.locals.securityUtil = require('../app/utils/securityUtils')
  app.locals.basedir = config.root

  app.set('pageConstants', pageConstants)

  /**
   * TODO
   * refactor this method and create a viewHelpers file
   */
  app.use(function (req, res, next) {

    res.locals.req =req;


    //for error case no logging is required, its done on APIUtil
    res.Render = function(view,err,data,req,res){
      if(err){
          if(err.statusCode >= 500){
            res.status(err.statusCode)
            return res.render('500',err.message)
          } else if(err.statusCode >= 400){
            res.status(err.statusCode)
            return res.render('404',err.message)
          }


        //fallback state
        res.status(500)
        return res.render('500',err.message)
      } else {
        if(!view){
          res.send(data)
        } else {
          res.render(view,data)
        }
      }
    }

    next();
  })

 // app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(config.root + '/dist/public'));
  app.use(flash())
  app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'blargadeeblargblarg12', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  }))

  app.use(require('express-domain-middleware'));
  app.use(function errorHandler(err, req, res, next) {
    console.log('error on request %d %s %s', process.domain.id, req.method, req.url);
    console.log(err.stack);
    res.send(500, "Something bad happened. :(");
    if(err.domain) {
      //you should think about gracefully stopping & respawning your server
      //since an unhandled error might put your application into an unknown state
    }
  });

  // view engine setup
  //app.set('view options', {pretty: true});
  app.set('views', config.root + '/dist/views');
  app.set('view engine', 'jade');
  app.set('x-powered-by',false)


}