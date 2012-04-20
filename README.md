## Elknode

Elknode is a node.js module for interfacing with the Elk M1 Gold automation controller.

This is currently half-baked and under development.

### Usage

To get started, call `createConnection()` to create a new connection

```javascript
var elknode = require('elknode');

/// create a connection
var elk = elknode.createConnection({ port: 2101 , host: '192.168.1.13' });

// register event handlers
elk.on('data', function(data){
  console.log('Got a message from the Elk');
});

// connect to the Elk and listen for messages
elk.listen();
```