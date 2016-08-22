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
  var msg = writeAscii(cmd + area.toString() + code.toString());
  return msg;
}

var writeTextDescriptionsMessage = function(cmd, type, address) {
  type = ('00' + type).substr(-2);
  address = ('000' + address).substr(-3);  
  var msg = writeAscii(cmd + type.toString() + address.toString());
  return msg;
}
  
var writeControlOutputOnMessage = function(cmd, controlOutput, duration) {
  controlOutput = ('000' + controlOutput).substr(-3);
  duration = ('00000' + duration).substr(-5);
  var msg = writeAscii(cmd + controlOutput.toString() + duration.toString());
  return msg;
}

var writePowerLineCarrierChangeMessage = function(cmd, houseCode, unitCode, functionCode, level, duration) {
  houseCode = houseCode.substr(-1);
  unitCode = ('00' + unitCode).substr(-2);
  functionCode = ('00' + functionCode).substr(-2);
  level = ('00' + level).substr(-2);
  duration = ('0000' + duration).substr(-4);
  var msg = writeAscii(cmd + houseCode.toString() + unitCode.toString() + functionCode.toString() + level.toString() + duration.toString());
  return msg;
}

var writeControlOutputOffMessage = function(cmd, controlOutput) {
  controlOutput = ('000' + controlOutput).substr(-3);
  var msg = writeAscii(cmd + controlOutput.toString());
  return msg;
}

var writeControlOutputToggleMessage = function(cmd, controlOutput) {
  controlOutput = ('000' + controlOutput).substr(-3);
  var msg = writeAscii(cmd + controlOutput.toString());
  return msg;
}

var writeTaskActivationMessage = function(cmd, task) {
  task = ('000' + task).substr(-3);
  var reserved = '0';
  var msg = writeAscii(cmd + task.toString() + reserved);
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

  //console.log('writeAscii: ' + ascii);
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
module.exports.writeTextDescriptionsMessage = writeTextDescriptionsMessage;
module.exports.writeControlOutputOnMessage = writeControlOutputOnMessage;
module.exports.writeControlOutputOffMessage = writeControlOutputOffMessage;
module.exports.writeControlOutputToggleMessage = writeControlOutputToggleMessage;
module.exports.writeTaskActivationMessage = writeTaskActivationMessage;
module.exports.writePowerLineCarrierChangeMessage = writePowerLineCarrierChangeMessage;
module.exports.writeAscii = writeAscii;
module.exports.calcChecksum = calcChecksum;

