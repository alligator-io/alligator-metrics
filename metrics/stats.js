var util = require('util');
var redis = require('redis');

exports.stats={
  name: 'stats',
  group: 'actionhero',
  title:'Action Hero',
  units: 'connections',
  slope: 'both',
  type: 'uint32',
  description:'Metrics for Connections',
  interval:1200,
  tmax:90,
  dmax:120,
  run:function(api,metric,send){
    if(api.config.metrics.stats.name)metric.name =api.config.metrics.stats.name;
    if(api.config.metrics.stats.title)metric.title =api.config.metrics.stats.title;
    if(api.config.metrics.stats.group)metric.group =api.config.metrics.stats.group;
    
    if(!util.isArray(api.config.metrics.stats.keys)){
      return api.log('The type of api.config.stats.keys must by an array','warning');
    }
    else if(api.config.metrics.stats.keys.length === 0){
      return api.log('The type of api.config.stats.keys is empty','warning');
    }
    
    var client = api.redis.client;
    var collection = api.config.metrics.stats.keys[0];
    
    var getValue = function(key,next){
     api.stats.get(key,collection,next); 
    };
    
    var sendStats = function(done){
      getValue('connections:totalActiveConnections',function(err,value){
        if(err)return done(err);
        var activeMetric = api.utils.objClone(metric);
        activeMetric.name += '_total_active_connections';
        activeMetric.title += ' Active Connections';
        activeMetric.value = value||0;
       
        send(activeMetric);
        getValue('connections:totalConnections',function(err,value){
          if(err)return done(err);
          var totalMetric = api.utils.objClone(metric);
          totalMetric.name +='_total_connections';
          totalMetric.value = value||0;
          totalMetric.title += ' Total Connections';
          send(totalMetric);
          done();
        });
      });
    };

    if(api.utils.isPlainObject(api.config.metrics.stats.redis)){
      var client = redis.createClient(api.config.metrics.stats.redis);
      client.on('error', function (err) {
        api.log(err.message,'error');
        client.end();
      });
      client.on('ready',function(){
        getValue=function(key,next){
          client.hget(collection, key, function(err, value){
            next(err, value);
          });
        };
        sendStats(function(err){
          if(err)api.log(err.message,'error');
          client.end();
        });
      });
    }else {
      sendStats(function(){api.log(err.message,'error');});
    }
  }
};