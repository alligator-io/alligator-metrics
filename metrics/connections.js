exports.connections={
  name: 'alligator_connections',
  group: 'alligator',
  title:'Connections',
  units: '',
  slope: 'both',
  type: 'uint32',
  description:'Metrics for Connections',
  interval:1200,
  tmax:90,
  dmax:120,
  run:function(api,metric,send){
    api.stats.get('connections:totalActiveConnections',function(err,value){
      if(err)return
      var activeMetric = api.utils.objClone(metric);
      activeMetric.name += '_active';
      activeMetric.title = 'Active ' + activeMetric.title;
      activeMetric.value = value||0;
      send(activeMetric);
    });
    api.stats.get('connections:totalConnections',function(err,value){
      if(err)return;
      var totalMetric = api.utils.objClone(metric);
      totalMetric.value = value||0;
      totalMetric.title ='Total ' + totalMetric.title;
      send(totalMetric);
    });
  }
};