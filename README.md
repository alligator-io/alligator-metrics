alligator-metrics
=================
alligator-metrics is a Ganglia metrics reporter.
#Quick Start
`git clone git://github.com/alligator-io/alligator-metrics.git`

`vi config/config.js`

`npm start`
#Configuration
Add Ganglia masters to array 
```javascript
config.metrics={
  hosts:[{
    host:'localhost',
    port:8649 // gmond port
  }]
}
```
#Metrics

## Creating a Metric
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
##Metric Options
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