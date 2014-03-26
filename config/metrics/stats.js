exports.default = {
  metrics: function(api){
    return {
      stats:{
        enabled:false,
        keys:['actionhero:stats'],
        redis:{
          host:'localhost',
          port: 6379,
          database:0
        }
      }
    };
  }
}