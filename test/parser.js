var parser = require('../lib/parser');

describe('parser', function(){
  
  describe('#parseMessage', function(){
    
    it('should return unknown for \'9999999999999999999\'', function(done){
      var results = parser.parseMessage('9999999999999999999');
      results.message.should.equal('Unknown message');
      done();
    });
    
    it('should parse \'Request Ethernet test\' message ok', function(done){
      var results = parser.parseMessage('16XK5435226130412110006E');
      results.message.should.equal('Request Ethernet test');
      results.length.should.equal(22);
      results.direction.should.equal('from');
      results.commandCode.should.equal('XK');
      done();
    });
    
  });
  
});