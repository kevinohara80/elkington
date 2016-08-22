var towords = require('../lib/towords');

describe('towords', function () {

  describe('#calc', function () {

    it('should return a single word for a single digit', function (done) {
      towords.calc(0).should.equal('zero');
      towords.calc(1).should.equal('one');
      towords.calc(2).should.equal('two');
      towords.calc(3).should.equal('three');
      towords.calc(4).should.equal('four');
      towords.calc(5).should.equal('five');
      towords.calc(6).should.equal('six');
      towords.calc(7).should.equal('seven');
      towords.calc(8).should.equal('eight');
      towords.calc(9).should.equal('nine');
      done();
    });

    it('should return a single word for a 10 to 19', function (done) {
      towords.calc(10).should.equal('ten');
      towords.calc(11).should.equal('eleven');
      towords.calc(12).should.equal('twelve');
      towords.calc(13).should.equal('thirteen');
      towords.calc(14).should.equal('fourteen');
      towords.calc(15).should.equal('fifteen');
      towords.calc(16).should.equal('sixteen');
      towords.calc(17).should.equal('seventeen');
      towords.calc(18).should.equal('eighteen');
      towords.calc(19).should.equal('nineteen');
      done();
    });

    it('should return a single word for a 20, 30, 40...90', function (done) {
      towords.calc(20).should.equal('twenty');
      towords.calc(30).should.equal('thirty');
      towords.calc(40).should.equal('forty');
      towords.calc(50).should.equal('fifty');
      towords.calc(60).should.equal('sixty');
      towords.calc(70).should.equal('seventy');
      towords.calc(80).should.equal('eighty');
      towords.calc(90).should.equal('ninety');
      done();
    });

    it('should return two words for 22 and 84', function (done) {
      towords.calc(22).should.equal('twenty two');
      towords.calc(84).should.equal('eighty four');
      done();
    });

    it('should return \'one hundred one\' for 101', function (done) {
      towords.calc(101).should.equal('one hundred one');
      done();
    });

    it('should return \'one hundred twenty one\' for 121', function (done) {
      towords.calc(121).should.equal('one hundred twenty one');
      done();
    });

    it('should return \'two thousand four hundred eighty three\' for 2483', function (done) {
      towords.calc(2483).should.equal('two thousand four hundred eighty three');
      done();
    });

    it('should add a point for decimals', function (done) {
      towords.calc(101.25).should.equal('one hundred one point two five');
      done();
    });

  });

});