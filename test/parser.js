var parser = require('../lib/parser');
var should = require('should');

var tests = [
  { ascii: '16XK5435226130412110006E', message: 'Request Ethernet test' },
  { ascii: '1EAS100000004000000030000000000E', message: 'Arming status report data' },
  { ascii: '0AZC006200CA', message: 'Zone change update' },
  { ascii: '16AR12345611340100110085', message: 'Alarm Reporting to Ethernet' },
  { ascii: '0AZC031900C5', message: 'Zone change update' },
  { ascii: '0ACC063000E0', message: 'Control output change update' },
  { ascii: '19UA000123C33036BC9A41F009F', message: 'User code areas report data' },
  { ascii: '0BPCA08010091', message: 'PLC change update' },
  { ascii: '1BSD01001Miller Res      0054', message: 'Text string description report data'}
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
    
    it('should parse \'Zone change update\' message ok', function(done){
      var results = parser.parseMessage(tests[4].ascii);
      results.message.should.equal(tests[4].message);
      results.length.should.equal(10);
      results.dataRaw.should.equal('031900');
      results.data.zoneNumber.should.equal(31);
      results.data.zoneStatus.should.equal('Violated: Open');
      done();
    });

    it('should parse \'Control output change update\' message ok', function(done){
      var results = parser.parseMessage(tests[5].ascii);
      results.message.should.equal(tests[5].message);
      results.length.should.equal(10);
      results.dataRaw.should.equal('063000');
      results.data.outputNumber.should.equal(63);
      results.data.outputState.should.equal('Off');
      done();
    });
    
    it('should parse \'User code areas report data\' message ok', function(done){
      var results = parser.parseMessage(tests[6].ascii);
      results.message.should.equal(tests[6].message);
      results.length.should.equal(25);
      results.dataRaw.should.equal('000123C33036BC9A41F00');
      results.data.userCode.should.equal('0123');
      results.data.userCodeValidAreas.length.should.equal(4);
      results.data.userCodeValidAreas[0].should.equal('area1');
      results.data.userCodeValidAreas[1].should.equal('area2');
      results.data.userCodeValidAreas[2].should.equal('area7');
      results.data.userCodeValidAreas[3].should.equal('area8');
      results.data.userCodeDigitCount.should.equal(4);
      results.data.userCodeType.should.equal('User');
      results.data.temperatureMode.should.equal('Fahrenheit');
      done();
    });
    
    it('should parse \'PLC change update\' message ok', function(done){
      var results = parser.parseMessage(tests[7].ascii);
      results.message.should.equal(tests[7].message);
      results.length.should.equal(11);
      results.dataRaw.should.equal('A080100');
      results.data.houseCode.should.equal('A');
      results.data.unitCode.should.equal(8);
      results.data.lightLevel.should.equal(1);
      done();
    });

    it('should parse \'Text string description report data\' message ok', function(done){
      var results = parser.parseMessage(tests[8].ascii);
      results.message.should.equal(tests[8].message);
      results.length.should.equal(27);
      results.dataRaw.should.equal('01001Miller Res      00');
      results.data.type.should.equal(1);
      results.data.typeName.should.equal('Area Name');
      results.data.address.should.equal(1);
      results.data.text.should.equal('Miller Res');
      done();
    });

  });
  
});
