var elknode = require('../index');
var request = require('request');
var elk = elknode.createConnection({ port: 2101 , host: '192.168.1.13'});

elk.on('connect', function(data) {
  
  var opts = {
    url: 'http://query.yahooapis.com/v1/public/yql',
    qs: {
      q: 'select item from weather.forecast where location = "48307"',
      format: 'json'
    }
  };
  
  request(opts, function(error, response, body) {
    if(!error) {
      var temp = JSON.parse(body).query.results.channel.item.condition.temp.toString();    
      elk.speak('outside temperature is ' + temp + ' degrees');
    }
    elk.disconnect();
  });
  
});