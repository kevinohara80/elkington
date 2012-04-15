var protocol = require('./protocol');

var writeArmingMessage = function(cmd, opts) {
  var area = (opts && opts.area) ? opts.area : 1;
  var instant = (opts && opts.instant) ? true : false;
  var code = (opts && opts.code) ? opts.code : 1234;
  if(code.length == 4) code = '00' + code;
  var msg = writeAscii(cmd + area.toString() + code.toString());
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

module.exports.writeArmingMessage = writeArmingMessage;
module.exports.writeAscii = writeAscii;
module.exports.calcChecksum = calcChecksum;
