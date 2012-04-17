var net = require('net');
var protocol = require('./protocol');
var parser = require('./parser');
var messaging = require('./messaging');
var EventEmitter = require('events').EventEmitter;

/*********************************/
/* ElkConnection definition      */
/*********************************/

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
    var msg = parser.parseMessage(data)
    msg.host = that._connection.address().address;
    msg.port = that.port;
    msg.remotePort = that._connection.address().port;
    that.emit('data', msg);
    that.emit(msg.commandCode, msg);
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
    that.emit('connect', 'Connected to Elk M1XEP at ' + that.host + ' and port ' + that.port);
  });
  
}

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
  this.once('AS', function(data){
    callback(data);
  });
  this._connection.write(messaging.writeAscii('as'));
}

ElkConnection.prototype.speak = function(message) {
  var commands = messaging.getWordCommands(message);
  for(var i=0; i<commands.length; i++) {
    this._connection.write(commands[i]);
  }
}

/*********************************/
/* exports                       */
/*********************************/

module.exports.createConnection = function(opts) {
  return new ElkConnection(opts);
}