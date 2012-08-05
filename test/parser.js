var parser = require('../lib/parser');
var should = require('should');

var tests = [
  { ascii: '16XK5435226130412110006E', message: 'Request Ethernet test' },
  { ascii: '1EAS100000004000000030000000000E', message: 'Arming status report data' },
  { ascii: '0AZC006200CA', message: 'Zone change update' },
  { ascii: '16AR12345611340100110085', message: 'Alarm Reporting to Ethernet' }
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
      results.dataRaw.should.equal('543522613041211000');
      done();
    });
    
    it('should parse \'Arming Status\' message ok', function(done){
      var results = parser.parseMessage(tests[1].ascii);
      results.message.should.equal(tests[1].message);
      results.length.should.equal(30);
      results.dataRaw.should.equal('10000000400000003000000000');
      results.data.should.have.property('area1');
      results.data.should.have.property('area2');
      results.data.should.have.property('area3');
      results.data.should.have.property('area4');
      results.data.should.have.property('area5');
      results.data.should.have.property('area6');
      results.data.should.have.property('area7');
      results.data.should.have.property('area8');
      results.data.area1.armStatus.should.equal('Armed Away');
      results.data.area1.alarmState.should.equal('Fire Alarm');
      done();
    });
    
    it('should parse \'Alarm Reporting\' message ok', function(done){
      var results = parser.parseMessage(tests[3].ascii);
      results.message.should.equal(tests[3].message);
      results.length.should.equal(22);
      results.dataRaw.should.equal('123456113401001100');
      results.data.area.should.equal(1);
      results.data.accountNumber.should.equal(123456);
      results.data.alarmCode.should.equal(1134);
      results.data.zone.should.equal(1);
      done();
    });
    
  });
  
});