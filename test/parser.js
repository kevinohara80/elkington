var parser = require('../lib/parser');

var tests = [
  { ascii: '16XK5435226130412110006E', message: 'Request Ethernet test' },
  { ascii: '1EAS000000001111111100000000000E', message: 'Arming status report data' },
  { ascii: '0AZC006200CA', message: 'Zone change update' }
];

describe('parser', function(){
  
  describe('#parseMessage', function(){
    
    it('should return unknown for \'9999999999999999999\'', function(done){
      var results = parser.parseMessage('9999999999999999999');
      results.message.should.equal('Unknown message');
      done();
    });
    
    it('should parse \'Request Ethernet test\' message ok', function(done){
      var results = parser.parseMessage(tests[0].ascii);
      results.message.should.equal(tests[0].message);
      results.length.should.equal(22);
      results.direction.should.equal('from');
      results.commandCode.should.equal('XK');
      done();
    });
    
  });
  
});