var protocol = require('./protocol');
var EventEmitter = require('events').EventEmitter;

var ElkConnection = function() {
  
}

// inherit from EventEmitter
ElkConnection.prototype = Object.create(EventEmitter.prototype);

ElkConnection.prototype.configure = function() {
  
}

ElkConnection.prototype.listen = function() {
  
}

var parseMessage = function(msg) {
  return 'testing';
}

/*********************************/
/* exports                       */
/*********************************/

module.exports.version = '0.0.0';

module.exports.createConnection = function() {
  return new ElkConnection();
}

module.exports.parseMessage = parseMessage;