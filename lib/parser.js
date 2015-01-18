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
  msgData.data = {};

  switch(msgData.commandCode) {
    case 'AR':
      msgData = parseAlarmReporting(msgData);
      break;
    case 'AS':
      msgData = parseArmingStatusData(msgData);
      break;
    case 'ZC':
      msgData = parseZoneChangeData(msgData);
      break;
    case 'CC':
      msgData = parseControlOutputData(msgData);
      break;
    case 'UA':
      msgData = parseRequestValidUserCodeData(msgData);
      break;  
    case 'PC':
      msgData = parsePowerLineCarrierData(msgData);
      break;  
    case 'SD':
      msgData = parseTextDescriptionsData(msgData);    
    }
  return msgData;
}

var parseAlarmReporting = function(msgData) {
  msgData.data.accountNumber = parseInt(msgData.dataRaw.substring(0,6));
  msgData.data.alarmCode = parseInt(msgData.dataRaw.substring(6,10));
  if(protocol.events[msgData.data.alarmCode.toString()]) {
    msgData.data.alarmMessage = protocol.events[msgData.data.alarmCode.toString()];
  } else {
    msgData.data.alarmMessage = 'Unknown alarm code message';
  }
  msgData.data.area = parseInt(msgData.dataRaw.substring(10,12));
  msgData.data.zone = parseInt(msgData.dataRaw.substring(12,15));
  msgData.data.telIp = parseInt(msgData.dataRaw.substring(15,16));
  return msgData;
}

var parseArmingStatusData = function(msgData) {
  
  var armStatuses = msgData.dataRaw.substring(0,8).split('');
  var armUpStates = msgData.dataRaw.substring(8,16).split('');
  var alarmStates = msgData.dataRaw.substring(16,24).split('');
  
  for(var i=1; i<=8; i++) {
    msgData.data['area' + i] = {};

    msgData.data['area' + i].armStatus = protocol.armStatuses[armStatuses[i-1]];
    msgData.data['area' + i].armUpState = protocol.armUpStates[armUpStates[i-1]];
    msgData.data['area' + i].alarmState = protocol.alarmStates[alarmStates[i-1]];
    
  }
  
  return msgData;
}

var parseZoneChangeData = function(msgData) {
  msgData.data.zoneNumber = parseInt(msgData.dataRaw.substring(0,3));
  msgData.data.zoneStatus = msgData.dataRaw.substring(3,4);
  if(protocol.zoneStatuses[msgData.data.zoneStatus.toString()]) {
    msgData.data.zoneStatus = protocol.zoneStatuses[msgData.data.zoneStatus.toString()];
  } else {
    msgData.data.zoneStatus = 'Unknown zone status message';
  }
  
  return msgData;  
}

var parseControlOutputData = function(msgData) {
  msgData.data.outputNumber = parseInt(msgData.dataRaw.substring(0,3));
  msgData.data.outputState = parseInt(msgData.dataRaw.substring(3,4));
  if(protocol.outputStates[msgData.data.outputState.toString()]) {
    msgData.data.outputState = protocol.outputStates[msgData.data.outputState.toString()];
  } else {
    msgData.data.outputState = 'Unknown output state message';
  }
  
  return msgData;  
}

var parseRequestValidUserCodeData = function(msgData) {
  msgData.data.userCode = msgData.dataRaw.substring(0,6);
  msgData.data.userCodeDigitCount = parseInt(msgData.dataRaw.substring(16,17));
  //handle leading zeros in user code
  msgData.data.userCode = ('000000' + msgData.data.userCode).substr(-msgData.data.userCodeDigitCount);
  
  msgData.data.userCodeValidAreas = new Array();
  var validAreas = msgData.dataRaw.substring(6,8);
  //convert to binary with leading zeros
  validAreas = ('00000000' + parseInt(validAreas, 16).toString(2)).substr(-8);
  //convert to areas
  for(var i=7; i>=0; i--) {
    if(validAreas[i] == 1)
      msgData.data.userCodeValidAreas.push('area' + (8-i));
  }
  
  msgData.data.userCodeType = msgData.dataRaw.substring(17,18);
  if(protocol.userCodeTypes[msgData.data.userCodeType.toString()]) {
    msgData.data.userCodeType = protocol.userCodeTypes[msgData.data.userCodeType.toString()];
  } else {
    msgData.data.temperatureMode = 'Unknown user code type message';
  }

  msgData.data.temperatureMode = msgData.dataRaw.substring(18,19);
  if(protocol.temperatureModes[msgData.data.temperatureMode.toString()]) {
    msgData.data.temperatureMode = protocol.temperatureModes[msgData.data.temperatureMode.toString()];
  } else {
    msgData.data.temperatureMode = 'Unknown temperature mode message';
  }
  
  return msgData;  
}

var parsePowerLineCarrierData = function(msgData) {
  msgData.data.houseCode = msgData.dataRaw.substring(0,1);
  msgData.data.unitCode = parseInt(msgData.dataRaw.substring(1,3));
  msgData.data.lightLevel = parseInt(msgData.dataRaw.substring(3,5));
  return msgData;  
}

var parseTextDescriptionsData = function(msgData) {
  msgData.data.type = parseInt(msgData.dataRaw.substring(0,2));
  msgData.data.typeName = protocol.textDescriptionsTypes[msgData.data.type];
  msgData.data.address = parseInt(msgData.dataRaw.substring(2,5));
  msgData.data.text = msgData.dataRaw.substring(5,21).trim();
  return msgData;  
}


module.exports.parseMessage = parseMessage;
