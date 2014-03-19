// actionHero Config File
// I will be loaded into api.config

var fs = require('fs');
var cluster = require('cluster');

var config = {};

/////////////////////////
// General Information //
/////////////////////////

config.general = {
  apiVersion: '0.2.0',
  serverName: 'Alligator Metrics',
  // id can be set here, or it will be generated dynamically.
  //  Be sure that every server you run has a unique ID (which will happen when generated dynamically)
//  id: 'myActionHeroServer',
  // A unique token to your application that servers will use to authenticate to each other
  serverToken: 'change-me',
  // The welcome message seen by TCP and webSocket clients upon connection
  welcomeMessage: 'Hello! Welcome to the actionHero api',
  // The body message to accompany 404 (file not found) errors regarding flat files
  flatFileNotFoundMessage: 'Sorry, that file is not found :(',
  // The message to accompany 500 errors (internal server errors)
  serverErrorMessage: 'The server experienced an internal error',
  // defaultLimit & defaultOffset are useful for limiting the length of response lists. 
  defaultLimit: 100,
  defaultOffset: 0,
  // the redis prefix for actionHero's cache objects
  cachePrefix: 'actionHero:cache:',
  // Watch for changes in actions and tasks, and reload/restart them on the fly
  developmentMode: true,
  // How many pending actions can a single connection be working on 
  simultaneousActions: 5,
  // configuration for your actionHero project structure
  paths: {
    'action':      __dirname + '/../actions',
    'task':        __dirname + '/../tasks',
    'public':      __dirname + '/../public',
    'pid':         __dirname + '/../pids',
    'log':         __dirname + '/../log',
    'server':      __dirname + '/../servers',
    'initializer': __dirname + '/../initializers',
    'metric': __dirname + '/../metrics'
  },
  // hash containing chat rooms you wish to be created at server boot 
  startingChatRooms: {
    // format is {roomName: {authKey, authValue}}
    //'secureRoom': {authorized: true},
  
  }
};

/////////////
// logging //
/////////////

config.logger = {
  transports: []
};

// console logger
if(cluster.isMaster){
  config.logger.transports.push(function(api, winston){
    return new (winston.transports.Console)({
      colorize: true,
      level: 'debug',
      timestamp: api.utils.sqlDateTime
    });
  });
}

// file logger
try{
  fs.mkdirSync('./log');
} catch(e) {
  if(e.code != 'EEXIST'){ console.log(e); process.exit(); }
}
config.logger.transports.push(function(api, winston) {
  return new (winston.transports.File)({
    filename: config.general.paths.log + '/' + api.pids.title + '.log',
    level: 'info',
    timestamp: true
  });
});

///////////
// Stats //
///////////

config.stats = {
  // how often should the server write its stats to redis?
  writeFrequency: 1000,
  // what redis key(s) [hash] should be used to store stats?
  //  provide no key if you do not want to store stats
  keys: [
  ]
}

///////////
// Redis //
///////////

config.redis = {
  fake: true,
  host: 'localhost',
  port: 6379,
  password: null,
  options: null,
  database: 0
};

//////////
// FAYE //
//////////

config.faye = {
  // faye's URL mountpoint.  Be sure to not overlap with an action or route
  mount: '/faye',
  // idle timeout for clients
  timeout: 45,
  // should clients ping the server?
  ping: null,
  // What redis server should we connect to for faye?
  redis: config.redis,
  // redis prefix for faye keys
  namespace: 'faye:'
};

///////////
// TASKS //
///////////

// see https://github.com/taskrabbit/node-resque for more information / options
config.tasks = {
  // Should this node run a scheduler to promote delayed tasks?
  scheduler: false,
  // what queues should the workers work and how many to spawn?
  //  ['*'] is one worker working the * queue
  //  ['high,low'] is one worker working 2 queues
  queues: [],
  // how long to sleep between jobs / scheduler checks
  timeout: 5000,
  // What redis server should we connect to for tasks / delayed jobs?
  redis: config.redis
}

//////////////////////
// Ganglia Masters  //
//////////////////////

config.metrics={
  hosts:[{
    host:'localhost',
    port:8649
  }],
  /*
  // load actionhero stats metrics
  stats:{
    keys:['actionhero:stats'],
    redis:{
      host:'localhost',
      port: 6379,
      database:0
    }
  },
  */
  /* 
  // load redis metrics
  redis:{
    host:'localhost',
    port: 6379,
    database:0
  },
  */
  // load elasticsearch metrics
  /*elasticsearch:{
    host:"http://localhost:9200",
    log:['error']
  }*/
};

/////////////
// SERVERS //
/////////////

// uncomment the section to enable the server

config.servers = {
};

//////////////////////////////////

exports.config = config;
