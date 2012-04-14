var net = require('net');
var protocol = require('./protocol');
var EventEmitter = require('events').EventEmitter;

var ElkConnection = function(opts) {
  if(!opts) opts = {};
  this.port = (opts.port) ? opts.port : 2000;
  this.host = (opts.host) ? opts.host : '192.168.1.2';
  this.defaultArmMode = (opts.defaultArmMode) ? opts.defaultArmMode.toLowerCase() : 'away';
  this._connection = null;
}

// inherit from EventEmitter
ElkConnection.prototype = Object.create(EventEmitter.prototype);

ElkConnection.prototype.configure = function() {
  
}

ElkConnection.prototype.listen = function() {
  
  var that = this;
  
  this._connection = new net.Socket();
  this._connection.setEncoding('ascii');
  
  // data event handler
  this._connection.on('data', function(data) {
    var msg = parseMessage(data)
    msg.host = that._connection.address().address;
    msg.port = that.port;
    msg.remotePort = that._connection.address().port;
    that.emit('data', msg);
  });
  
  // error event handler
  this._connection.on('error', function(err){
    if(err.code == 'ECONNREFUSED') {
      that.emit('error', 'Connection to M1XEP failed!');
    } else {
      that.emit('error', err.code);
    }
  });
  
  // close event handler
  this._connection.on('close', function(){
    that.emit('end', 'The connection to the Elk M1 has been lost');
  });
  
  this._connection.connect(this.port, this.host, function(){
    //connect listener
    that.emit('connect', 'Connected to Elk at ' + that.host + ' and port ' + that.port);
  });
  
}

ElkConnection.prototype.disarm = function(opts) {
  this._connection.write(writeArmingMessage('a0', opts));
}

ElkConnection.prototype.armAway = function(opts) {
  this._connection.write(writeArmingMessage('a1', opts));
}

ElkConnection.prototype.armStay = function(opts) {
  this._connection.write(writeArmingMessage('a2', opts));
}

ElkConnection.prototype.armStayInstant = function(opts) {
  this._connection.write(writeArmingMessage('a3', opts));
}

ElkConnection.prototype.armNight = function(opts) {
  this._connection.write(writeArmingMessage('a4', opts));
}

ElkConnection.prototype.armNightInstant = function(opts) {
  this._connection.write(writeArmingMessage('a5', opts));
}

ElkConnection.prototype.armVacation = function(opts) {
  this._connection.write(writeArmingMessage('a6', opts));
}

ElkConnection.prototype.armStepAway = function(opts) {
  this._connection.write(writeArmingMessage('a7', opts));
}

ElkConnection.prototype.armStepStay = function(opts) {
  this._connection.write(writeArmingMessage('a8', opts));
}

ElkConnection.prototype.speak = function(message) {
  
  var speakMessage = '';
  
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
        this._connection.write(writeAscii(wordString));
      }
    }
  }

}

var parseMessage = function(msg) {
  
  var msgData = {};
  msgData.raw = msg.replace('\r', '').replace('\n', '');
  msgData.length = parseInt(msg.substring(0,2), 16);
  msgData.commandCode = msg.substring(2,4);
  
  var command;
  
  if(protocol.commands[msgData.commandCode]) {
    command = protocol.commands[msgData.commandCode];
  }
  
  if(msgData.commandCode.length == 2) {
    if(msgData.commandCode.substring(0,1) == msgData.commandCode.substring(0,1).toUpperCase()) {
      msgData.direction = 'from';
    } else {
      msgData.direction = 'to';
    }
  }
  
  if(command) {
    msgData.message = command;
  } else {
    msgData.message = 'Unknown message';
  }
  
  return msgData;
}

var writeArmingMessage = function(cmd, opts) {
  var area = (opts && opts.area) ? opts.area : 1;
  var instant = (opts && opts.instant) ? true : false;
  var code = (opts && opts.code) ? opts.code : 1234;
  if(code.length == 4) code = '00' + code;
  var msg = writeAscii(cmd + area.toString() + code.toString());
  return msg
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

/*********************************/
/* exports                       */
/*********************************/

module.exports.version = '0.0.0';

module.exports.createConnection = function(opts) {
  return new ElkConnection(opts);
}

module.exports.parseMessage = parseMessage;

module.exports.calcChecksum = calcChecksum;