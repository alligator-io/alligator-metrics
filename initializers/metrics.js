var domain = require('domain');
var fs = require('fs');
var Gmetric = require('gmetric');
var util = require('util');
var os = require('os');

var metrics = function(api, next){

  api.metrics={metrics:{},timers:{}};

  api.exceptionHandlers.metric = function(domain, err, metric){
    api.stats.increment('exceptions:metrics');
    try {
      api.log('! uncaught error from metric ' + metric.name, 'alert');
    } catch(e){
      api.log('! uncaught error from metric: ' + e.message, 'alert');
    }
    api.exceptionHandlers.renderError(err);
    if(api.metrics.timers[metric.name]!=null)clearInterval(api.metrics.timers[metric.name]);
    delete api.metrics.timers[metric.name];
    domain.exit();
  };

  api.metrics.validateMetric = function(metric){
    var fail = function(msg){
      api.log(msg + '; exiting.', 'emerg');
    }
    if(typeof metric.name !== 'string' || metric.name.length < 1){
      fail('an metric is missing \'metric.name\'');
      return false;
    }

    if(typeof metric.interval !== 'number'){
      fail('an metric is missing \'metric.interval\'');
      return false;
    }
    if(typeof metric.run !== 'function'){
      fail('an metric is missing \'metric.run\'');
      return false;
    }
    return true;
  }

  api.metrics.loadDirectory = function(path){

    if(path == null){
      path = api.config.general.paths.metric;

      if(!fs.existsSync(api.config.general.paths.metric)){
        api.log(api.config.general.paths.metric + ' defined as metrics path, but does not exist', 'warning');
      }
    }

    fs.readdirSync(path).forEach( function(file) {
      if(path[path.length - 1] != '/'){ path += '/' }
      var fullFilePath = path + file;
      if(file[0] != '.'){
        var stats = fs.statSync(fullFilePath);
        if(stats.isDirectory()){
          api.metrics.loadDirectory(fullFilePath);
        } else if(stats.isSymbolicLink()){
          var realPath = fs.readlinkSync(fullFilePath);
          api.metrics.loadDirectory(realPath);
        } else if(stats.isFile()){
          var fileParts = file.split('.');
          var ext = fileParts[(fileParts.length - 1)];
          if(ext === 'js'){ api.metrics.loadFile(fullFilePath) }
        } else {
          api.log(file + ' is a type of file I cannot read', 'error')
        }
      }
    });
  }

  api.metrics.startTimer = function(metric){
    if(api.metrics.timers[metric.name])clearInterval(api.metrics.timers[metric.name]);
    api.metrics.timers[metric.name]=setInterval(function(){
      var metricDomain = domain.create();
      metricDomain.on('error', function(err){
        api.exceptionHandlers.metric(metricDomain, err, metric);
      });
      metricDomain.run(function(){
        metric.run(api,api.utils.objClone(metric),function(metric,callback) {
          if(!api.utils.isPlainObject(api.config.metrics) && util.isArray(api.config.metrics.hosts) && api.config.metrics.hosts.length < 1){
            api.log('metric ' + metric.name + ' has no hosts in config.metrics','warning');
            return;
          }
          for(var k in api.config.metrics.hosts){
            var host = api.config.metrics.hosts[k];
            if(typeof host.host === 'string'&& typeof host.port === 'number'){
              delete metric.run;
              delete metric.interval;
              if(metric.description)delete metric.description;
              api.metrics.gmetric.send(host.host,host.port,metric);
            }
            else{
              api.log('metric ' + metric.name + ' wrong host config ' + host.host + ' '+ host.port+ ' in config.metrics.hosts','warning');
            }
          }
          if(typeof callback ==="function")callback();
        });
      });
    },metric.interval);
  };

  api.metrics.stopTimers=function(){
    for(var t in Object.keys(api.metrics.timers)){
      clearInterval(api.metrics.timers[t]);
    }
  }

  api.metrics.startTimers=function(){
    for(var t in api.metrics.metrics){
      api.metrics.startTimer(api.metrics.metrics[t]);
    }
  }

  api.metrics.loadFile = function(fullFilePath, reload){
    if(reload == null){ reload = false; }
    var loadMessage = function(metric){
      var msgString = '';
      if(reload){
        msgString = 'metrics (re)loaded: ' + metric.name +', ' + fullFilePath;
      } else {
        msgString = 'metric loaded: ' + metric.name + ', ' + fullFilePath;
      }
      api.log(msgString, 'debug');
    }

    api.watchFileAndAct(fullFilePath, function(){
      var cleanPath = fullFilePath;
      if('win32' === process.platform){
        cleanPath = fullFilePath.replace(/\//g, '\\');
      }

      delete require.cache[require.resolve(cleanPath)];
      api.metrics.loadFile(fullFilePath, true);
    })

    try {
      var collection = require(fullFilePath);
      for(var i in collection){
        var metric = collection[i];  
        if(api.utils.isPlainObject(api.config.metrics) && api.config.metrics[metric.name]){
          if(!metric.spoof)metric.spoof = false;
          if(!metric.hostname)metric.hostname = os.hostname();
          if(!metric.group)metric.group=api.config.general.shortName;
          if(!metric.type)metric.type='int32';
            if(reload)api.metrics.startTimer(metric);
          api.metrics.metrics[metric.name] =metric;
          api.metrics.validateMetric(metric);
          loadMessage(metric);
        }
      }
    } catch(err){
      api.exceptionHandlers.loader(fullFilePath, err);
      if(api.metrics.timers[metric.name]!=null)clearInterval(api.metrics.timers[metric.name]);
      delete api.metrics.timers[metric.name];
      delete api.metrics.metrics[metric.name];
    }
  };

  api.metrics._start=function(api,next){
    api.metrics.gmetric = new Gmetric();
    api.metrics.startTimers();
    api.log('timers for metrics started','info');
    next();
  };

  api.metrics._teardown=function(api,next){
    api.metrics.stopTimers();
    api.log('timers for metrics stopped','info');
    next();
  };

  api.metrics.loadDirectory();

  next();
};

exports.metrics=metrics;