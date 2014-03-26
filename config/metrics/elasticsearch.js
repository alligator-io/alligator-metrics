exports.default = {
  metrics: function(api){
    return {
      elasticsearch:{
        enabled:false,
        host:'http://localhost:9200',
        log:['error']
      }
    };
  }
}