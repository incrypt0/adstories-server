// Redis Config

var redis = require('redis');
var client = redis.createClient();
client.on('connect', function() {
  console.log('connected to redis');
});
module.exports=Redis= client;