var path = require('path');
var fs = require('fs');

exports.default = {
  metrics: function(api){
    api.config.general.paths.plugin.forEach(function(p){
      api.config.general.metrics.forEach(function(plugin){
        var pluginPackageBase = path.normalize(p + '/' + plugin);
        if(api.project_root != pluginPackageBase){
          if(fs.existsSync(pluginPackageBase + '/actions')){api.config.general.paths.action.push(pluginPackageBase + '/actions');}
          if(fs.existsSync(pluginPackageBase + '/tasks')){api.config.general.paths.task.push(pluginPackageBase + '/tasks');}
          if(fs.existsSync(pluginPackageBase + '/servers')){api.config.general.paths.server.push(pluginPackageBase + '/servers');}
          if(fs.existsSync(pluginPackageBase + '/initializers')){api.config.general.paths.initializer.push( pluginPackageBase + '/initializers' );}
          if(fs.existsSync(pluginPackageBase + '/metrics')){api.config.general.paths.metrics.push( pluginPackageBase + '/metrics' );}
        }
      });
    });

    return {
      hosts:[{
        host:'localhost',
        port:8649
      }]
    };
  }
}