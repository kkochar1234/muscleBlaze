var path = require('path'),
    projectPath = path.normalize(__dirname + '/..');

module.exports={
  root : require('path').normalize(__dirname + '/..'),
  app: {
    name: 'MuscleBlaze'
  },
  hkAPI : {
    url : "http://api.healthkart.com/api",
    accessKey : 6369092314
  },
  web :{
    url : '',
    css : 'http://css.brghtlpl.com',
    js : 'http://js.brghtlpl.com'
  },
  logs : {
    accessLogFile: path.resolve(projectPath, '../logs/access.log'),
    applicationLogFile: path.resolve(projectPath, '../logs/muscleBlaze.log'),
    databaseLogFile: path.resolve(projectPath, '../logs/db.log'),
    level: "info",
    maxsize: 20971520
  },
  port:8080
}