var messaging = require('../lib/messaging');

describe('messaging', function(){
  
  describe('#getWordCommands', function(){
    
    it('should return an array', function(done) {
      messaging.getWordCommands('intruder').should.be.an.instanceof(Array);
      done();
    });
    
    it('should return an array of two for \'intruder alert\'', function(done) {
      messaging.getWordCommands('intruder alert').should.have.length(2);
      done();
    });
    
  });
  
  describe('#writeArmingMessage', function(){
    
  });
  
  describe('#writeAscii', function(){
    
  });
  
  describe('#calcChecksum', function(){
    
  });
  
});