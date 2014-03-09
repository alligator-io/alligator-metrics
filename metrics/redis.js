var redis = require('redis');

exports.redis={
    name: 'redis',
    group: 'redis',
    title:'',
    units: '',
    slope: 'zero',
    type: 'uint32',
    description:'Metrics for Redis Info',
    interval:15000,
    tmax:90,
    dmax:120,
    run:function(api,metric,send){
      if(api.config.redis.fake === true)return api.log('redis metrics not work with fakeredis','warning');
      var client = api.redis.client;
      client.info(function (err, res) {
        client.on_info_cmd(err, res);
        var info = client.server_info;

        var version = api.utils.objClone(metric);
        version.name = 'redis_version';
        version.title = 'Redis Version';
        version.value = info.redis_versions;
        version.type='string';
        version.slope='zero';
        send(version);

        var role = api.utils.objClone(metric);
        role.name = 'redis_role';
        role.title = 'Redis role';
        role.value = info.role;
        role.type='string';
        role.slope='zero';
        send(role);

        var sha1 = api.utils.objClone(metric);
        sha1.name = 'redis_git_sha1';
        sha1.title = 'Redis git sha1';
        sha1.value = info[sha1.name];
        sha1.type='string';
        sha1.slope='zero';
        send(sha1);

        var uptime = api.utils.objClone(metric);
        uptime.name = 'redis_uptime_in_seconds';
        uptime.title = 'Redis uptime in seconds';
        uptime.value = info.uptime_in_seconds;
        uptime.type='uint32';
        uptime.slope='zero';

        send(uptime);

        var uptime = api.utils.objClone(metric);
        uptime.name = 'redis_uptime_in_days';
        uptime.title = 'Redis uptime in days';
        uptime.value = info.uptime_in_days;
        uptime.type='uint32';
        uptime.slope='zero';
        send(uptime);

        var memory = api.utils.objClone(metric);
        memory.name = 'redis_used_memory';
        memory.title = 'Used memory';
        memory.units='KB',
        memory.value = parseFloat(info.used_memory/1000);
        memory.type='float';
        memory.slope='both';
        send(memory);
        
        var connections = api.utils.objClone(metric);
        connections.name = 'redis_connected_clients';
        connections.title = 'Connected Clients';
        connections.units='clients',
        connections.value = info.connected_clients;
        connections.type='uint16';
        connections.slope='both';
        send(connections);
        
        var slaves = api.utils.objClone(metric);
        slaves.name = 'redis_connected_slaves';
        slaves.title = 'Connected Slaves';
        slaves.units='slaves',
        slaves.value = info.connected_slaves;
        slaves.type='uint16';
        slaves.slope='both';
        send(slaves);
        
        var blocked = api.utils.objClone(metric);
        blocked.name = 'redis_blocked_clients';
        blocked.title = 'Blocked Clients';
        blocked.units='clients',
        blocked.value = info.blocked_clients;
        blocked.type='uint32';
        blocked.slope='both';
        send(blocked);
        
        var channels = api.utils.objClone(metric);
        channels.name = 'redis_pubsub_channels';
        channels.title = 'PUB/SUB Channels';
        channels.units='channels',
        channels.value = info.pubsub_channels;
        channels.type='uint16';
        channels.slope='both';
        send(channels);
        
        var patterns = api.utils.objClone(metric);
        patterns.name = 'redis_pubsub_patterns';
        patterns.title = 'PUB/SUB Patterns';
        patterns.units='patterns',
        patterns.value = info.pubsub_patterns;
        patterns.type='uint16';
        patterns.slope='both';
        send(patterns);
        
        var totalConnections = api.utils.objClone(metric);
        totalConnections.name = 'redis_total_connections_received';
        totalConnections.title = 'Redis Total Connections';
        totalConnections.units='connections',
        totalConnections.value = info.total_connections_received;
        totalConnections.type='uint32';
        totalConnections.slope='zero';
        send(totalConnections);
        
        var totalCommands = api.utils.objClone(metric);
        totalCommands.name = 'redis_total_commands_processed';
        totalCommands.title = 'Redis Total Commands Processed';
        totalCommands.units='commands ',
        totalCommands.value = info.total_commands_processed;
        totalCommands.type='uint32';
        totalCommands.slope='zero';
        send(totalCommands);
        
      });
    
    }
};