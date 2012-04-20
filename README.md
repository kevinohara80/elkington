# Elknode

Elknode is a node.js module for interfacing with the Elk M1 Gold automation controller. 

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

## API

Once you create a connection, the following methods are available.

### listen()

The listen method initiates the connection to the Elk.

### on(event, callback) 

Register an event listener

### disarm([callback])

Disarm the Elk. Callback is optional.