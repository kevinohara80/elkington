var net          = require('net');
var tls          = require('tls');
var protocol     = require('./lib/protocol');
var parser       = require('./lib/parser');
var messaging    = require('./lib/messaging');
var safereturn   = require('safereturn');
var EventEmitter = require('events').EventEmitter;

// safereturn overrides
safereturn.defaultTimeout = 3000;

safereturn.onTimeout = function(wrappedCallback, oldError) {
  var err = new Error('The Elk M1XEP failed to respond');
  wrappedCallback(err);
}

/*********************************/
/* ElkConnection definition      */
/*********************************/

var ElkConnection = function(opts) {
  
  if(!opts) opts = {};
  
  this.port            = opts.port || 2101;
  this.host            = opts.host || '192.168.1.2';
  this.responseTimeout = opts.responseTimeout || 3000;
  this.useSecure       = (opts.useSecure === true) ? true : false;
  this.username        = opts.username || null;
  this.password        = opts.password || null;

  this._authorized     = false;

  this.defaultArmMode  = (opts.defaultArmMode) 
                         ? opts.defaultArmMode.toLowerCase() 
                         : 'away';
  
  var that = this;

  function afterConnect() {

    that._connection.setEncoding('ascii');
  
    // data event handler
    that._connection.on('data', function(data) {

      data = data.trim().replace('\r', '').replace('\n', '');

      // check for elk auth requests
      if(data == 'Username:') {
        return that._connection.write(that.username + '\r\n');
      } else if(data.indexOf('Password:') != -1) {
        return that._connection.write(that.password + '\r\n');
      } else if(data.indexOf('Elk-M1XEP: Login successful.') !== -1) {
        that._authorized = true;
        that.emit('connect');
      }

      // we are getting a weird message during auth process
      if(that.useSecure && (!that._authorized || data.substring(0,2) === '**')) {
        return;
      }

      // if we are not using un/pw, we are connected and ready
      if(!that.useSecure) that.emit('connect');

      // assuming the above passes, we parse the elk message and emit
      var msg        = parser.parseMessage(data);
      msg.time       = new Date();
      msg.host       = that._connection.address().address;
      msg.port       = that.port;
      msg.remotePort = that._connection.address().port;
      that.emit('any', msg);
      that.emit(msg.commandCode, msg);
    });
    
    // error event handler
    that._connection.on('error', function(err){
      if(err.code == 'ECONNREFUSED') {
        that.emit('error', 'Connection to M1XEP failed!');
      } else {
        that.emit('error', err.code);
      }
    });
    
    // close event handler
    that._connection.on('close', function(){
      that.emit('end', 'The connection to the Elk M1 has been lost');
    });

  }
  
  if(this.useSecure) {
    this._connection = new tls.connect(this.port, this.host, {}, afterConnect);
  } else {
    this._connection = new net.connect(this.port, this.host, afterConnect);
  }
  
}

// inherit from EventEmitter
ElkConnection.prototype = Object.create(EventEmitter.prototype);

ElkConnection.prototype.disconnect = function() {
  if(this._connection) this._connection.destroy();
}

ElkConnection.prototype.disarm = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a0', opts));
}

ElkConnection.prototype.armAway = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a1', opts));
}

ElkConnection.prototype.armStay = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a2', opts));
}

ElkConnection.prototype.armStayInstant = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a3', opts));
}

ElkConnection.prototype.armNight = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a4', opts));
}

ElkConnection.prototype.armNightInstant = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a5', opts));
}

ElkConnection.prototype.armVacation = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a6', opts));
}

ElkConnection.prototype.armStepAway = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a7', opts));
}

ElkConnection.prototype.armStepStay = function(opts) {
  this._connection.write(messaging.writeArmingMessage('a8', opts));
}

ElkConnection.prototype.armingStatusRequest = function(callback) {
  if(callback && typeof callback === 'function') {
    callback = safereturn(callback, this.responseTimeout);
    this.once('AS', function(data){
      callback(null, data);
    });
  }
  this._connection.write(messaging.writeAscii('as'));
}

ElkConnection.prototype.alarmByZoneRequest = function(callback) {
  if(callback && typeof callback === 'function') {
    callback = safereturn(callback, this.responseTimeout);
    this.once('AZ', function(data){
      callback(null, data);
    });
  }
  this._connection.write(messaging.writeAscii('az'));
}

ElkConnection.prototype.speak = function(message) {
  var commands = messaging.getWordCommands(message);
  for(var i=0; i<commands.length; i++) {
    this._connection.write(commands[i]);
  }
}

ElkConnection.prototype.zoneDefinitionRequest = function(callback) {
  if(callback && typeof callback === 'function') {
    callback = safereturn(callback, this.responseTimeout);
    this.once('ZD', function(data){
      callback(null, data);
    });
  }
  this._connection.write(messaging.writeAscii('zd'));
}

ElkConnection.prototype.textDescriptionRequest = function(type, address, callback) {
  if(callback && typeof callback === 'function') {
    callback = safereturn(callback, this.responseTimeout);
    this.once('SD', function(data){
      callback(null, data);
    });
  }
  this._connection.write(messaging.writeTextDescriptionsMessage('sd', type, address));
}

/*********************************/
/* exports                       */
/*********************************/

module.exports.createConnection = function(opts) {
  return new ElkConnection(opts);
}

module.exports.version = '0.0.2';
