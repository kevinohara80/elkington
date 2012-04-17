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
  
  switch(msgData.commandCode) {
    case 'AS':
      msgData = parseArmingStatusData(msgData);
      break;
  }
  
  return msgData;
}

var parseArmingStatusData = function(msgData) {
  
  var armStatuses = msgData.dataRaw.substring(0,8).split('');
  var armUpStates = msgData.dataRaw.substring(8,16).split('');
  var alarmStates = msgData.dataRaw.substring(16,24).split('');

  
  for(var i=0; i<=7; i++) {
    msgData['area' + (i+1)] = {};
    
    switch(parseInt(armStatuses[i])) {
      case 0:
        msgData['area' + (i+1)].armStatus = 'Disarmed';
        break;
      case 1: 
        msgData['area' + (i+1)].armStatus = 'Armed Away';
        break;
      case 2: 
        msgData['area' + (i+1)].armStatus = 'Armed Stay';
        break;
      case 3:
        msgData['area' + (i+1)].armStatus = 'Armed Stay Instant';
        break;
      case 4:
        msgData['area' + (i+1)].armStatus = 'Armed to Night';
        break;
      case 5:
        msgData['area' + (i+1)].armStatus = 'Armed to Night Instant';
        break;
      case 6:
        msgData['area' + (i+1)].armStatus = 'Armed to Vacation';
        break;
    }
    
    // implement the other two arrays
    
  }
  
  return msgData;
}

module.exports.parseMessage = parseMessage;