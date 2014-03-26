alligator-metrics
=================
alligator-metrics is a Ganglia metrics reporter.
#Quick Start

[![NPM](https://nodei.co/npm/alligator-metrics.png?downloads=true)](https://nodei.co/npm/alligator-metrics/)

`vi config/metrics.js`

`npm start`

#Configuration
Config files for metrics in config/metrics
##General
- Edit config/metrics.js
- Add Ganglia masters to array 
```javascript
return {
  hosts:[{
    host:'localhost', 
    port:8649 // gmond port
  }]
};
```
## Redis Metrics
- Edit config/metrics/redis.js
```javascript
 return {
      redis:{
        enabled:true, // enable/disable
        host:'localhost',
        port: 6379,
        database:0
      }
    };
```
## Elasticsearch Metrics
- Edit config/metrics/elasticsearch.js
```javascript
return { 
  elasticsearch:{
    enabled:true, // enable/disable
    host:"http://localhost:9200",
    log:['error']
  }
};
```

# Creating a Metric
You can create you own Metric by placing them in a ./metrics/ folder
create a yourMetric.js file.
Here's an example of a simple metric which will report to ganglia the number of cpus:
```javascript
var os = require('os');
exports.cpus={
  title:'NodeJS CPUs Count',
  name: 'node_cpu_num',
  group: 'cpu',
  units: 'CPUs',
  slope: 'zero',
  type: 'uint16',
  description:'Number of CPUs',
  interval:1200,
  tmax:10,
  dmax:60,
  run:function(api,metric,send){
    metric.value=os.cpus().length;
    send(metric);
  }
};
```
#Metric Options
```javascript
title:'NodeJS CPUs Count',
name: 'node_cpu_num',
group: 'cpu',
units: 'CPUs',  // unit of your metric
slope: 'zero',  // zero | positive | negative | both | unspecified
type: 'uint16', // string | uint | uint8 | uint16 | uint32 | int8 | int16 | int32 | float | double
description:'Number of CPUs',
interval:1200,  // Periodic reporting interval in milliseconds
tmax:10,
dmax:60
```
#Plugins
## Creating a Plugin
* Create a project with the following structure:
```text
/
  initializers/
  metrics/
  scripts/
  config/
  package.json
```
* Write an metric file in metrics/ folder for example:

  **[See the Creating a Metric section](#creating-a-metric)**

- Write an config file for the metric to config/ folder for example config/metrics/cpu.js:
```javascript
exports.default = {
  metrics: function(api){
    return { 
      'node_cpu_num':{
        enabled:true
      }
    };
  }
}
```
- Write an config install script to scripts/postinstall.js file for example:
```javascript
#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var localConfig   = path.normalize(__dirname + '/../config/cpu.js');
var configPath = path.normalize(process.cwd() + '/../../config/metrics');
var config = path.normalize(process.cwd() + '/../../config/metrics/cpu.js');

if(!fs.existsSync(config)){
  console.log("coppying " + localConfig + " to " + config)
  try{ fs.mkdirSync(configPath); }catch(e){ }
  fs.createReadStream(localConfig).pipe(fs.createWriteStream(config));
}
```
- Add to package.json the install script:
```javascript
"scripts": {
  "postinstall": "scripts/postinstall.js"
}
```

## Including a Plugin
- Add to package.json your plugin:
```JSON
  "dependencies": {
    "am-your-plugin":"1.0.0"
  }
```
- Add to config/api.js your plugin:
```javascript
metrics:[ // this is a list of metric plugin names
  'am-your-plugin'
],
```
## [More Info](http://actionherojs.com/wiki/core/plugins.html)