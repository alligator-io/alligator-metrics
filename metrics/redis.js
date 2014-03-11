var redis = require('redis');

exports.redis={
    name: 'redis',
    group: 'redis',
    title:'Redis',
    units: '',
    slope: 'zero',
    type: 'uint32',
    description:'Metrics for Redis Info',
    interval:15000,
    tmax:90,
    dmax:120,
    run:function(api,metric,send){
      var client = redis.createClient(api.config.metrics.redis);
      client.on('error', function (err) {
        api.log(err.message,'error');
        client.end();
      });

      client.on('ready',function(){
          var info = client.server_info;

          var version = api.utils.objClone(metric);
          version.name = 'redis_version';
          version.title = metric.title + ' Version';
          version.value = info.redis_version;
          version.type='string';
          version.slope='zero';
          send(version);

          var role = api.utils.objClone(metric);
          role.name = 'redis_role';
          role.title = metric.title + ' Redis role';
          role.value = info.role;
          role.type='string';
          role.slope='zero';
          send(role);

          var sha1 = api.utils.objClone(metric);
          sha1.name = 'redis_git_sha1';
          sha1.title = metric.title + ' Redis git sha1';
          sha1.value = info[sha1.name];
          sha1.type='string';
          sha1.slope='zero';
          send(sha1);

          var uptime = api.utils.objClone(metric);
          uptime.name = 'redis_uptime_in_seconds';
          uptime.title = metric.title + ' Uptime In Seconds';
          uptime.value = info.uptime_in_seconds;
          uptime.type='uint32';
          uptime.slope='zero';
          send(uptime);

          var uptime = api.utils.objClone(metric);
          uptime.name = 'redis_uptime_in_days';
          uptime.title = metric.title + ' Uptime In Days';
          uptime.value = info.uptime_in_days;
          uptime.type='uint32';
          uptime.slope='zero';
          send(uptime);

          var memory = api.utils.objClone(metric);
          memory.name = 'redis_used_memory';
          memory.title = metric.title + ' Used Memory';
          memory.units='KB';
          memory.value = parseFloat(info.used_memory/1000);
          memory.type='float';
          memory.slope='both';
          send(memory);

          var connections = api.utils.objClone(metric);
          connections.name = 'redis_connected_clients';
          connections.title = metric.title + ' Connected Clients';
          connections.units='clients';
          connections.value = info.connected_clients;
          connections.type='uint16';
          connections.slope='both';
          send(connections);

          var slaves = api.utils.objClone(metric);
          slaves.name = 'redis_connected_slaves';
          slaves.title = metric.title + ' Connected Slaves';
          slaves.units='slaves';
          slaves.value = info.connected_slaves;
          slaves.type='uint16';
          slaves.slope='both';
          send(slaves);

          var blocked = api.utils.objClone(metric);
          blocked.name = 'redis_blocked_clients';
          blocked.title = metric.title + ' Blocked Clients';
          blocked.units='clients';
          blocked.value = info.blocked_clients;
          blocked.type='uint32';
          blocked.slope='both';
          send(blocked);

          var channels = api.utils.objClone(metric);
          channels.name = 'redis_pubsub_channels';
          channels.title = metric.title + ' PUB/SUB Channels';
          channels.units='channels';
          channels.value = info.pubsub_channels;
          channels.type='uint16';
          channels.slope='both';
          send(channels);

          var patterns = api.utils.objClone(metric);
          patterns.name = 'redis_pubsub_patterns';
          patterns.title = metric.title + ' PUB/SUB Patterns';
          patterns.units='patterns';
          patterns.value = info.pubsub_patterns;
          patterns.type='uint16';
          patterns.slope='both';
          send(patterns);

          var totalConnections = api.utils.objClone(metric);
          totalConnections.name = 'redis_total_connections_received';
          totalConnections.title = metric.title + ' Total Connections';
          totalConnections.units='connections';
          totalConnections.value = info.total_connections_received;
          totalConnections.type='uint32';
          totalConnections.slope='zero';
          send(totalConnections);

          var totalCommands = api.utils.objClone(metric);
          totalCommands.name = 'redis_total_commands_processed';
          totalCommands.title = metric.title + ' Total Commands Processed';
          totalCommands.units='commands';
          totalCommands.value = info.total_commands_processed;
          totalCommands.type='uint32';
          totalCommands.slope='zero';
          send(totalCommands);

          var expiredKeys = api.utils.objClone(metric);
          expiredKeys.name = 'redis_expired_keys';
          expiredKeys.title = metric.title + ' Expired Keys';
          expiredKeys.units='keys';
          expiredKeys.value = info.expired_keys;
          expiredKeys.type='uint32';
          expiredKeys.slope='both';
          send(expiredKeys);

          var keyspaceHits = api.utils.objClone(metric);
          keyspaceHits.name = 'redis_keyspace_hits';
          keyspaceHits.title = metric.title + ' Keyspace Hits';
          keyspaceHits.units='keys';
          keyspaceHits.value = info.keyspace_hits;
          keyspaceHits.type='uint32';
          keyspaceHits.slope='both';
          send(keyspaceHits);

          var keyspaceMisses = api.utils.objClone(metric);
          keyspaceMisses.name = 'redis_keyspace_misses';
          keyspaceMisses.title = metric.title + ' Keyspace Misses';
          keyspaceMisses.units='keys';
          keyspaceMisses.value = info.keyspace_misses;
          keyspaceMisses.type='uint32';
          keyspaceMisses.slope='both';
          send(keyspaceMisses);
          client.end();
      });
    }
};