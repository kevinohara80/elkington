var protocol = require('./protocol');

var parseMessage = function(msg) {
  
  var msgData = {};
  msgData.commandCode = msg.substring(2,4);
  msgData.raw = msg.replace('\r', '').replace('\n', '');
  
  var msgLen = parseInt(msg.substring(0,2), 16);
  if(msgLen > 0) msgData.length = msgLen;
  
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
  
  msgData.dataRaw = msg.substring(4, msg.length - 2);

  switch(msgData.commandCode) {
    case 'AR':
      msgData = parseAlarmReporting(msgData);
      break;
    case 'AS':
      msgData = parseArmingStatusData(msgData);
      break;
    
  }
  
  return msgData;
}

var parseAlarmReporting = function(msgData) {
  return msgData;
}

var parseArmingStatusData = function(msgData) {
  
  var armStatuses = msgData.dataRaw.substring(0,8).split('');
  var armUpStates = msgData.dataRaw.substring(8,16).split('');
  var alarmStates = msgData.dataRaw.substring(16,24).split('');
  
  msgData.data = {};
  
  for(var i=0; i<=7; i++) {
    msgData.data['area' + (i+1)] = {};
    
    switch(parseInt(armStatuses[i])) {
      case 0:
        msgData.data['area' + (i+1)].armStatus = 'Disarmed';
        break;
      case 1: 
        msgData.data['area' + (i+1)].armStatus = 'Armed Away';
        break;
      case 2: 
        msgData.data['area' + (i+1)].armStatus = 'Armed Stay';
        break;
      case 3:
        msgData.data['area' + (i+1)].armStatus = 'Armed Stay Instant';
        break;
      case 4:
        msgData.data['area' + (i+1)].armStatus = 'Armed to Night';
        break;
      case 5:
        msgData.data['area' + (i+1)].armStatus = 'Armed to Night Instant';
        break;
      case 6:
        msgData.data['area' + (i+1)].armStatus = 'Armed to Vacation';
        break;
    }
    
    switch(parseInt(armUpStates[i])) {
      case 0:
        msgData.data['area' + (i+1)].armUpState = 'Not Ready to Arm';
        break;
      case 1: 
        msgData.data['area' + (i+1)].armUpState = 'Ready to Arm';
        break;
      case 2: 
        msgData.data['area' + (i+1)].armUpState = 'Ready to Arm, but a zone is violated and can be force armed';
        break;
      case 3:
        msgData.data['area' + (i+1)].armUpState = 'Armed with Exit Timer working';
        break;
      case 4:
        msgData.data['area' + (i+1)].armUpState = 'Armed Fully';
        break;
      case 5:
        msgData.data['area' + (i+1)].armUpState = 'Force Armed with a force arm zone violated';
        break;
      case 6:
        msgData.data['area' + (i+1)].armUpState = 'Armed with a Bypass';
        break;
    }
    
    switch(alarmStates[i]) {
      case '0':
        msgData.data['area' + (i+1)].alarmState = 'No Alarm Active';
        break;
      case '1': 
        msgData.data['area' + (i+1)].alarmState = 'Entrance Delay is Active';
        break;
      case '2': 
        msgData.data['area' + (i+1)].alarmState = 'Alarm Abort Delay Active';
        break;
      case '3':
        msgData.data['area' + (i+1)].alarmState = 'Fire Alarm';
        break;
      case '4':
        msgData.data['area' + (i+1)].alarmState = 'Medical Alarm';
        break;
      case '5':
        msgData.data['area' + (i+1)].alarmState = 'Police Alarm';
        break;
      case '6':
        msgData.data['area' + (i+1)].alarmState = 'Burglar Alarm';
        break;  
      case '7':
        msgData.data['area' + (i+1)].alarmState = 'Aux1 Alarm';
        break;
      case '8':
        msgData.data['area' + (i+1)].alarmState = 'Aux2 Alarm';
        break;  
      case '9':
        msgData.data['area' + (i+1)].alarmState = 'Aux3 Alarm';
        break;  
      case ':': 
        msgData.data['area' + (i+1)].alarmState = 'Aux4 Alarm';
        break;
      case ';': 
        msgData.data['area' + (i+1)].alarmState = 'Carbon Monoxide Alarm';
        break;
      case '<':
        msgData.data['area' + (i+1)].alarmState = 'Emergency Alarm';
        break;
      case '=':
        msgData.data['area' + (i+1)].alarmState = 'Freeze Alarm';
        break;
      case '>':
        msgData.data['area' + (i+1)].alarmState = 'Gas Alarm';
        break;
      case '?':
        msgData.data['area' + (i+1)].alarmState = 'Heat Alarm';
        break;  
      case '@':
        msgData.data['area' + (i+1)].alarmState = 'Water Alarm';
        break;
      case 'A':
        msgData.data['area' + (i+1)].alarmState = 'Fire Supervisory';
        break;  
      case 'B':
        msgData.data['area' + (i+1)].alarmState = 'Verify Fire';
        break;
        
    }
    
  }
  
  return msgData;
}



module.exports.parseMessage = parseMessage;