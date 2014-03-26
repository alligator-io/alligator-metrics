exports.default = {
  metrics: function(api){
    return {
      redis:{
        enabled:false,
        host:'localhost',
        port: 6379,
        database:0
      }
    };
  }
}