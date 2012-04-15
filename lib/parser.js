var protocol = require('./protocol');

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
  
  msgData.dataRaw = msg.substring(4, msg.length - 6);
  
  return msgData;
}

module.exports.parseMessage = parseMessage;