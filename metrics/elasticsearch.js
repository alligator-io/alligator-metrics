var es = require('elasticsearch');

exports.elasticsearch={
  name: 'elasticsearch',
  group: 'elasticsearch',
  title:'Elasticsearch',
  units: '',
  slope: 'zero',
  type: 'uint32',
  description:'Metrics for Elasticsearch',
  interval:15000,
  tmax:90,
  dmax:120,
  run:function(api,metric,send){
    if(!this.client)this.client  = new es.Client(api.utils.objClone(api.config.metrics.elasticsearch));
    this.client.cluster.nodeStats({indices:true,jvm:true,nodeId:'_local'},
    function(err,stats){
      var clusterName = api.utils.objClone(metric);
      clusterName.name = 'es_cluster_name';
      clusterName.title = metric.title + ' Cluster Name';
      clusterName.value = stats.cluster_name;
      clusterName.type='string';
      clusterName.slope='zero';
      send(clusterName);

      var local = stats.nodes[Object.keys(stats.nodes)[0]];

      var docsCount = api.utils.objClone(metric);
      docsCount.name = 'es_indices_docs_count';
      docsCount.title = metric.title +' Documents Count';
      docsCount.value = local.indices.docs.count;
      docsCount.units='docs';
      docsCount.type='uint32';
      docsCount.slope='both';
      send(docsCount);

      var docsDeleted = api.utils.objClone(metric);
      docsDeleted.name = 'es_indices_docs_deleted';
      docsDeleted.title =  metric.title+' Documents Deleted';
      docsDeleted.value = local.indices.docs.deleted;
      docsDeleted.type='uint32';
      docsDeleted.slope='both';
      docsDeleted.units='docs';
      send(docsDeleted);

      var storeSize = api.utils.objClone(metric);
      storeSize.name = 'es_indices_store_size';
      storeSize.title =  metric.title+ ' Store Size';
      storeSize.value = local.indices.store.size_in_bytes;
      storeSize.units='Bytes';
      storeSize.type='double';
      storeSize.slope='both';
      send(storeSize);

      var indexTotal = api.utils.objClone(metric);
      indexTotal.name = 'es_indices_indexing_index_total';
      indexTotal.title =  metric.title+ ' Indexing Index Total';
      indexTotal.value = local.indices.indexing.index_total;
      indexTotal.units='indices';
      indexTotal.type='double';
      indexTotal.slope='both';
      send(indexTotal);

      var indexTime = api.utils.objClone(metric);
      indexTime.name = 'es_indices_indexing_index_time';
      indexTime.title =  metric.title+ ' Indexing Index Time';
      indexTime.value = local.indices.indexing.index_time_in_millis;
      indexTime.units='ms';
      indexTime.type='uint32';
      indexTime.slope='both';
      send(indexTime);

      var deleteTotal = api.utils.objClone(metric);
      deleteTotal.name = 'es_indices_indexing_delete_total';
      deleteTotal.title =  metric.title+ ' Indexing Delete Total';
      deleteTotal.value = local.indices.indexing.delete_total;
      deleteTotal.units='indices';
      deleteTotal.type='double';
      deleteTotal.slope='both';
      send(deleteTotal);

      var deleteTime = api.utils.objClone(metric);
      deleteTime.name = 'es_indices_indexing_delete_time';
      deleteTime.title =  metric.title+ ' Indexing Delete Time';
      deleteTime.value = local.indices.indexing.delete_time_in_millis;
      deleteTime.units='ms';
      deleteTime.type='uint32';
      deleteTime.slope='both';
      send(deleteTime);

      var indexCurrent = api.utils.objClone(metric);
      indexCurrent.name = 'es_indices_indexing_index_current';
      indexCurrent.title =  metric.title+ ' Indexing Index Current';
      indexCurrent.value = local.indices.indexing.index_current;
      indexCurrent.units='indices';
      indexCurrent.type='double';
      indexCurrent.slope='both';
      send(indexCurrent);

      var getTotal = api.utils.objClone(metric);
      getTotal.name = 'es_indices_get_total';
      getTotal.title =  metric.title+ ' Get Total';
      getTotal.value = local.indices.get.total;
      getTotal.units='indices';
      getTotal.type='double';
      getTotal.slope='both';
      send(getTotal);
 
      var getTime = api.utils.objClone(metric);
      getTime.name = 'es_indices_get_time';
      getTime.title =  metric.title+ ' Get Time';
      getTime.value = local.indices.get.time_in_millis;
      getTime.units='ms';
      getTime.type='uint32';
      getTime.slope='both';
      send(getTime);

      var missingTime = api.utils.objClone(metric);
      missingTime.name = 'es_indices_get_missing_time';
      missingTime.title =  metric.title+ ' Get Missing Time';
      missingTime.value = local.indices.get.missing_time_in_millis;
      missingTime.units='ms';
      missingTime.type='uint32';
      missingTime.slope='both';
      send(missingTime);

      var getExistsTotal = api.utils.objClone(metric);
      getExistsTotal.name = 'es_indices_get_exists_total';
      getExistsTotal.title =  metric.title+ ' Get Exists Total';
      getExistsTotal.value = local.indices.get.exists_total;
      getExistsTotal.units='indices';
      getExistsTotal.type='double';
      getExistsTotal.slope='both';
      send(getExistsTotal);

      var getExistsTime = api.utils.objClone(metric);
      getExistsTime.name = 'es_indices_get_exists_time';
      getExistsTime.title =  metric.title+ ' Get Exists Time';
      getExistsTime.value = local.indices.get.exists_time_in_millis;
      getExistsTime.units='ms';
      getExistsTime.type='uint32';
      getExistsTime.slope='both';
      send(getExistsTime);

      var sQueryTotal = api.utils.objClone(metric);
      sQueryTotal.name = 'es_indices_search_query_total';
      sQueryTotal.title =  metric.title+ ' Search Query Total';
      sQueryTotal.value = local.indices.search.query_total;
      sQueryTotal.units='queries';
      sQueryTotal.type='double';
      sQueryTotal.slope='both';
      send(sQueryTotal);

      var sQueryTime = api.utils.objClone(metric);
      sQueryTime.name = 'es_indices_search_query_time';
      sQueryTime.title =  metric.title+ ' Search Query Time';
      sQueryTime.value = local.indices.search.query_time_in_millis;
      sQueryTime.units='ms';
      sQueryTime.type='uint32';
      sQueryTime.slope='both';
      send(sQueryTime);

      var sQueryCurrent = api.utils.objClone(metric);
      sQueryCurrent.name = 'es_indices_search_query_current';
      sQueryCurrent.title =  metric.title+ ' Search Query Current';
      sQueryCurrent.value = local.indices.search.query_current;
      sQueryCurrent.units='queries';
      sQueryCurrent.type='double';
      sQueryCurrent.slope='both';
      send(sQueryCurrent);

      var sFetchTotal = api.utils.objClone(metric);
      sFetchTotal.name = 'es_indices_search_fetch_total';
      sFetchTotal.title =  metric.title+ ' Search Fetch Total';
      sFetchTotal.value = local.indices.search.fetch_total;
      sFetchTotal.units='queries';
      sFetchTotal.type='double';
      sFetchTotal.slope='both';
      send(sFetchTotal);

      var sFetchTime = api.utils.objClone(metric);
      sFetchTime.name = 'es_indices_search_fetch_time';
      sFetchTime.title =  metric.title+ ' Search Fetch Time';
      sFetchTime.value = local.indices.search.fetch_time_in_millis;
      sFetchTime.units='ms';
      sFetchTime.type='uint32';
      sFetchTime.slope='both';
      send(sFetchTime);

      var sFetchCurrent = api.utils.objClone(metric);
      sFetchCurrent.name = 'es_indices_search_fetch_current';
      sFetchCurrent.title =  metric.title+ ' Search Fetch Current';
      sFetchCurrent.value = local.indices.search.fetch_current;
      sFetchCurrent.units='queries';
      sFetchCurrent.type='double';
      sFetchCurrent.slope='both';
      send(sFetchCurrent);

      var mergesCurrent = api.utils.objClone(metric);
      mergesCurrent.name = 'es_indices_merges_current';
      mergesCurrent.title =  metric.title+ ' Merges Current';
      mergesCurrent.value = local.indices.merges.current;
      mergesCurrent.units='indices';
      mergesCurrent.type='double';
      mergesCurrent.slope='both';
      send(mergesCurrent);

      var mergesCurrentDocs = api.utils.objClone(metric);
      mergesCurrentDocs.name = 'es_indices_merges_current_docs';
      mergesCurrentDocs.title =  metric.title+ ' Merges Current Docs';
      mergesCurrentDocs.value = local.indices.merges.current_docs;
      mergesCurrentDocs.units='docs';
      mergesCurrentDocs.type='double';
      mergesCurrentDocs.slope='both';
      send(mergesCurrentDocs);

      var mergesCurrentSize = api.utils.objClone(metric);
      mergesCurrentSize.name = 'es_indices_merges_current_size';
      mergesCurrentSize.title =  metric.title+ ' Merges Current Size';
      mergesCurrentSize.value = local.indices.merges.current_size_in_bytes;
      mergesCurrentSize.units='Bytes';
      mergesCurrentSize.type='double';
      mergesCurrentSize.slope='both';
      send(mergesCurrentSize);

      var mergesTotal = api.utils.objClone(metric);
      mergesTotal.name = 'es_indices_merges_total';
      mergesTotal.title =  metric.title+ ' Merges Total';
      mergesTotal.value = local.indices.merges.total;
      mergesTotal.units='indices';
      mergesTotal.type='double';
      mergesTotal.slope='both';
      send(mergesTotal);

      var mergesTotalDocs = api.utils.objClone(metric);
      mergesTotalDocs.name = 'es_indices_merges_total_docs';
      mergesTotalDocs.title =  metric.title+ ' Merges Total Docs';
      mergesTotalDocs.value = local.indices.merges.total_docs;
      mergesTotalDocs.units='docs';
      mergesTotalDocs.type='double';
      mergesTotalDocs.slope='both';
      send(mergesTotalDocs);

      var mergesTotalSize = api.utils.objClone(metric);
      mergesTotalSize.name = 'es_indices_merges_total_size';
      mergesTotalSize.title =  metric.title+ ' Merges Total Size';
      mergesTotalSize.value = local.indices.merges.total_size_in_bytes;
      mergesTotalSize.units='Bytes';
      mergesTotalSize.type='double';
      mergesTotalSize.slope='both';
      send(mergesTotalSize);

      var mergesTotalTime = api.utils.objClone(metric);
      mergesTotalTime.name = 'es_indices_merges_total_time';
      mergesTotalTime.title =  metric.title+ ' Merges Total Time';
      mergesTotalTime.value = local.indices.merges.total_time_in_millis;
      mergesTotalTime.units='ms';
      mergesTotalTime.type='uint32';
      mergesTotalTime.slope='both';
      send(mergesTotalTime);

      var refreshTotal = api.utils.objClone(metric);
      refreshTotal.name = 'es_indices_refresh_total';
      refreshTotal.title =  metric.title+ ' Refresh Total';
      refreshTotal.value = local.indices.refresh.total;
      refreshTotal.units='indices';
      refreshTotal.type='double';
      refreshTotal.slope='both';
      send(refreshTotal);

      var refreshTotalTime = api.utils.objClone(metric);
      refreshTotalTime.name = 'es_indices_refresh_total_time';
      refreshTotalTime.title =  metric.title+ ' Refresh Total Time';
      refreshTotalTime.value = local.indices.refresh.total_time_in_millis;
      refreshTotalTime.units='ms';
      refreshTotalTime.type='uint32';
      refreshTotalTime.slope='both';
      send(refreshTotalTime);

      var flushTotal = api.utils.objClone(metric);
      flushTotal.name = 'es_indices_flush_total';
      flushTotal.title =  metric.title+ ' Flush Total';
      flushTotal.value = local.indices.flush.total;
      flushTotal.units='indices';
      flushTotal.type='double';
      flushTotal.slope='both';
      send(flushTotal);

      var flushTotalTime = api.utils.objClone(metric);
      flushTotalTime.name = 'es_indices_flush_total_time';
      flushTotalTime.title =  metric.title+ ' Flush Total Time';
      flushTotalTime.value = local.indices.flush.total_time_in_millis;
      flushTotalTime.units='ms';
      flushTotalTime.type='uint32';
      flushTotalTime.slope='both';
      send(flushTotalTime);

      var warmerTotal = api.utils.objClone(metric);
      warmerTotal.name = 'es_indices_warmer_total';
      warmerTotal.title =  metric.title+ ' Warmer Total';
      warmerTotal.value = local.indices.warmer.total;
      warmerTotal.units='indices';
      warmerTotal.type='double';
      warmerTotal.slope='both';
      send(warmerTotal);

      var warmerCurrent = api.utils.objClone(metric);
      warmerCurrent.name = 'es_indices_warmer_current';
      warmerCurrent.title =  metric.title+ ' Warmer Current';
      warmerCurrent.value = local.indices.warmer.current;
      warmerCurrent.units='indices';
      warmerCurrent.type='double';
      warmerCurrent.slope='both';
      send(warmerCurrent);

      var warmerTotalTime = api.utils.objClone(metric);
      warmerTotalTime.name = 'es_indices_warmer_total_time';
      warmerTotalTime.title =  metric.title+ ' Warmer Total Time';
      warmerTotalTime.value = local.indices.warmer.total_time_in_millis;
      warmerTotalTime.units='ms';
      warmerTotalTime.type='uint32';
      warmerTotalTime.slope='both';
      send(warmerTotalTime);
     
      var nonHeapUsed = api.utils.objClone(metric);
      nonHeapUsed.name = 'es_jvm_non_heap_used';
      nonHeapUsed.title =  metric.title+ ' JVM Non Heap Used';
      nonHeapUsed.value = local.jvm.mem.non_heap_used_in_bytes;
      nonHeapUsed.units='Bytes';
      nonHeapUsed.type='double';
      nonHeapUsed.slope='both';
      send(nonHeapUsed);

      var nonHeapUsed = api.utils.objClone(metric);
      nonHeapUsed.name = 'es_jvm_non_heap_used';
      nonHeapUsed.title =  metric.title+ ' JVM Non Heap Used';
      nonHeapUsed.value = local.jvm.mem.non_heap_used_in_bytes;
      nonHeapUsed.units='Bytes';
      nonHeapUsed.type='double';
      nonHeapUsed.slope='both';
      send(nonHeapUsed);

      var heapUsed = api.utils.objClone(metric);
      heapUsed.name = 'es_indices_merges_current_size';
      heapUsed.title =  metric.title+ ' JVM Heap Used';
      heapUsed.value = local.jvm.mem.heap_used_in_bytes;
      heapUsed.units='Bytes';
      heapUsed.type='double';
      heapUsed.slope='both';
      send(heapUsed);

      var heapCommitted = api.utils.objClone(metric);
      heapCommitted.name = 'es_jvm_heap_committed';
      heapCommitted.title =  metric.title+ ' JVM Heap Committed';
      heapCommitted.value = local.jvm.mem.heap_committed_in_bytes;
      heapCommitted.units='Bytes';
      heapCommitted.type='double';
      heapCommitted.slope='both';
      send(heapCommitted);

      var nonHeapCommitted = api.utils.objClone(metric);
      nonHeapCommitted.name = 'es_jvm_non_heap_committed';
      nonHeapCommitted.title =  metric.title+ ' JVM Non Heap Committed';
      nonHeapCommitted.value = local.jvm.mem.non_heap_committed_in_bytes;
      nonHeapCommitted.units='Bytes';
      nonHeapCommitted.type='double';
      nonHeapCommitted.slope='both';
      send(nonHeapCommitted);
    });
  }
};