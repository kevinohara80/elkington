var net = require('net');
var protocol = require('./protocol');
var EventEmitter = require('events').EventEmitter;

var ElkConnection = function() {
  this.port = 2101;
  this.host = '192.168.1.13';
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
  this._connection.setNoDelay(true);
  
  // data event handler
  this._connection.on('data', function(data) {
    var msg = parseMessage(data)
    msg.host = that.host;
    msg.port = that.port;
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

ElkConnection.prototype.speak = function(message) {
  
  var speakMessage = '';
  
  var tokens = message.toLowerCase().split(' ');
  console.log('tokens:' + tokens.length);
  
  for(var i=0; i<tokens.length; i++) {
    if(protocol.words[tokens[i]]) {
      var wordNum = protocol.words[tokens[i]];
      console.log('Found num ' + wordNum.toString() + ' for word: ' + tokens[i]);
      var wordString;
      if(wordNum < 10) {
        wordString = '00' + wordNum.toString();
      } else if(wordNum < 100) {
        wordString = '0' + wordNum.toString();
      } else {
        wordString = wordNum.toString();
      }
      if(wordString) {
        speakMessage += '09sw' + wordString + '00B4\r\n';
        console.log(speakMessage);
      }
    }
  }
  
  if(speakMessage) this._connection.write(speakMessage); 

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

/*********************************/
/* exports                       */
/*********************************/

module.exports.version = '0.0.0';

module.exports.createConnection = function() {
  return new ElkConnection();
}

module.exports.parseMessage = parseMessage;