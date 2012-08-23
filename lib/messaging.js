var protocol = require('./protocol');
var toWords  = require('./towords');

var getWordCommands = function(message) {
  
  var wordCommands = [];
  var tokens = message.toLowerCase().split(' ');
  
  for(var i=0; i<tokens.length; i++) {
    if(protocol.words[tokens[i]]) {
      var wordNum = protocol.words[tokens[i]];
      var wordString;
      if(wordNum < 10) {
        wordString = '00' + wordNum.toString();
      } else if(wordNum < 100) {
        wordString = '0' + wordNum.toString();
      } else {
        wordString = wordNum.toString();
      }
      if(wordString) {
        wordString = 'sw' + wordString;
        wordCommands.push(writeAscii(wordString))
      }
    //check fo numbers and use towords.js to parse
    } else if(tokens[i] == parseFloat(tokens[i])) {
        var words = toWords.calc(tokens[i]);
        var n = getWordCommands(words);
        wordCommands = wordCommands.concat(n);
    }
  }
  return wordCommands;
}

var writeArmingMessage = function(cmd, opts) {
  var area = (opts && opts.area) ? opts.area.toString() : '1';
  var instant = (opts && opts.instant) ? true : false;
  var code = (opts && opts.code) ? opts.code.toString() : '1234';
  if(code.length == 4) code = '00' + code;
  console.log('code: ' + code);
  var msg = writeAscii(cmd + area.toString() + code.toString());
  console.log('msg: ' + msg);
  return msg;
}

var writeAscii = function(command) {
  var ascii;
  var len;
  var lenString;
  var cc;
  
  // add the reserved 00 from elk protocol
  command = command + '00';
  
  // calculate the ascii length and prepend the string
  len = command.length + 2;
  lenString = len.toString(16).toUpperCase();
  if(lenString.length == 1) lenString = '0' + lenString;
  ascii = lenString + command;
  
  // get the checksum and append
  cc = calcChecksum(ascii);
  ascii = ascii + cc + '\r\n';

  return ascii;
}

var calcChecksum = function(string) {
  var buf = new Buffer(string);

  // Calculate the modulo 256 checksum
  var sum = 0;
  for (var i = 0, l = buf.length; i < l; i++) {
    sum = (sum + buf[i]) % 256;
  }
  // Find the compliment
  sum = 256 - sum;

  // Convert to a two byte uppercase hex value
  var chars = sum.toString(16).toUpperCase();
  if (chars.length == 1) chars = '0' + chars;
  return chars;
}

module.exports.getWordCommands = getWordCommands;
module.exports.writeArmingMessage = writeArmingMessage;
module.exports.writeAscii = writeAscii;
module.exports.calcChecksum = calcChecksum;
