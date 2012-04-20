# elknode

elknode is a node.js module for interfacing with the Elk M1 Gold automation controller. 

This is currently half-baked and under development.

## Features

* Simple API with function calls for Elk commands
* Optional callbacks 

## Usage

To get started, call `createConnection()` to create a new connection, register some event handlers, then call `listen()`:

```javascript
var elknode = require('elknode');

/// create a connection
var elk = elknode.createConnection({ port: 2101 , host: '192.168.1.13' });

// register event handlers
elk.on('any', function(data){
  console.log('Incoming message: ' + data.message);
});

// connect to the Elk and listen for messages
elk.listen();
```

elknode provides a lot of commands. Some of the commands will invoke a response from the controller. You can optionally pass in a callback to these commands.

```javascript
elk.alarmByZoneRequest(function(err, data){
  if(err) {
    console.log(err.message);
  } else {
    console.log('Got the alarm by zone response');
  }
});
```

Or you can listen for the response in a separate event handler and just call the method.

```javascript
// AZ is the message type for 'Alarm by Zone Reply'
elk.on('AZ', function(data) {
  console.log('area1 arm status: ' + data.area1.armStatus);
});

elk.alarmByZoneRequest();
```

## API

Once you create a connection, the following methods are available.

### listen()

The listen method initiates the connection to the Elk.

### on(event, callback) 

Register an event listener.

### disarm([callback])

Disarm the Elk. Callback is optional.

### armAway([options])

Arm the Elk in Away Mode.

### armStay([options])

Arm the Elk in Stay Mode.

### armStayInstant([options])

Arm the Elk in Stay Mode instantaneously.

### armNight([options])

Arm the Elk in Night Mode.

### armNightInstant([options])

Arm the Elk in Night Mode instantaneously.

