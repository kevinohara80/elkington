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

### Handling events

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

### Speaking

The Elk M1 has a large library of words that it can say over it's speaker. With the elknode `speak()` function, you can make your Elk say all kinds of stuff.

```javascript
elk.speak('defective hottub pump');
```

Or something more useful:

```javascript
var elknode = require('elknode');
var request = require('request');
var elk = elknode.createConnection({ port: 2101 , host: '192.168.1.13'});

elk.on('connect', function(data) {
  
  // get the weather when connected to the Elk.
  var opts = {};
  opts.url = 'http://query.yahooapis.com/v1/public/yql';
  opts.qs = {};
  opts.qs.q = 'select item from weather.forecast where location = "48307"';
  opts.qs.format = 'json';
  
  request(opts, function(error, response, body) {
    if(!error) {
      var temp = JSON.parse(body).query.results.channel.item.condition.temp.toString();    
      elk.speak('outside temperature is ' + temp + ' degrees');
    }
  });
  
}); 

elk.listen();

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

## Events

elknode can emit the following events:

* `any`: Any message from the Elk
* `AR`: Alarm Reporting to Ethernet
* `AS`: Arming status report data
* `AT`: Ethernet Test to IP
* `AZ`: Alarm by zone reply
* `CC`: Control output change update
* `CR`: Custom value report data
* `CS`: Control output status report data
* `CU`: Change user code reply
* `CV`: Counter Value Data
* `DS`: Lighting Poll Response
* `DK`: Display KP LCD Data
* `EM`: Email Trigger to M1XEP
* `IC`: Send invalid user code digits
* `IE`: Installer program exited
* `IP`: M1XSP Insteon Program
* `IR`: M1XSP Insteon Read
* `KA`: Keypad areas report data
* `KC`: Keypad key change update
* `KF`: Function key pressed data
* `LD`: Log data with index
* `LW`: Reply temperature data
* `PC`: PLC change update
* `PS`: PLC status report data
* `RE`: Reset Ethernet Module
* `RP`: ELKRP connected
* `RR`: Real Time Clock Data
* `SD`: Text string description report data
* `SS`: System Trouble Status data
* `ST`: Temperature report data
* `TC`: Task change update
* `TR`: Thermostat data report
* `UA`: User code areas report data
* `VN`: Reply Version Number of M1
* `XB`: reserved by ELKRP
* `XK`: Request Ethernet test
* `ZB`: Zone bypass report data
* `ZC`: Zone change update
* `ZD`: Zone definition report data
* `ZP`: Zone partition report data
* `ZS`: Zone status report data
* `ZV`: Zone analog voltage data

### Words

The elknode `speak()` function supports the following words:

*custom1, custom2, custom3, custom4, custom5, custom6, custom7, custom8, custom9, custom10, zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, hundred, thousand, silence200ms, silence500ms, tone800hz, a, access, acknowledged, ac_power, activate, activated, active, adjust, air, alarm, alert, all, am, an, and, answer, any, are, area, arm, armed, at, attic, audio, auto, authorized, automatic, automation, auxiliary, away, b, back, barn, basement, bathroom, battery, bedroom, been, bell, bottom, break, breakfast, bright, building, burglar, button, by, bypassed, cabinet, call, camera, cancel, carbon_monoxide, card, center, central, change, check, chime, circuit, clear, closed, closet, code, cold, condition, connect, control, cool, cooling, corner, crawlspace, danger, day, deck, decrease, defective, degrees, delay, den, denied, detected, detector, device, dial, dialing, dim, dining_room, disable, disarm, disarmed, dock, door, doors, down, driveway, east, emergency, enable, end, energy, enrollment, enter, entering, entertainment, enter_the, entry, environment, equipment, error, evacuate, event, exercise, expander, exit, exterior, f, fail, failure, family_room, fan, feed, fence, fire, first, flood, floor, followed, force, fountain, foyer, freeze, front, full, furnace, fuse, game, garage, gas, gate, glass, go, good, goodbye, great, group, guest, gun, hall, hallway, hanging_up, hang_up, has, has_expired, have, hear_menu_options, heat, help, high, hold, home, hot, hottub, house, humidity, hvac, if, immediately, in, inches, increase, inner, input, inside, instant, interior, in_the, intruder, intruder_message, intrusion, invalid, is, is_about_to_expire, is_active, is_armed, is_canceled, is_closed, is_disarmed, is_low, is_off, is_ok, is_on, is_open, jacuzzi, jewelry, keep, key, keypad, kitchen, lamp, laundry, lawn, leak, leave, left, less, level, library, light, lights, line, living_room, loading, lobby, location, lock, low, lower, m, machine, mail, main, mains, manual, master, max, media, medical, medicine, memory, menu, message, middle, minute, missing, mode, module, monitor, more, motion, motor, next, night, no, normal, north, not, notified, now, number, nursery, of, off, office, oh, ok, on, online, only, open, operating, option, or, other, out, outlet, output, outside, over, overhead, panel, panic, parking, partition, patio, pause, perimeter, personal, phone, place, play, please, plus, pm, police, pool, porch, port, pound, pounds, power, press, pressure, problem, program, protected, pump, radio, raise, ready, rear, receiver, record, recreation, relay, remain_calm, remote, repeat, report, reporting, reset, restored, return, right, roof, room, running, safe, save, screen, second, secure, security, select, sensor, serial, service, set, setback, setpoint, setting, shed, shipping, shock, shop, shorted, shunted, side, silence, siren, sliding, smoke, someone, south, spare, speaker, sprinkler, stairs, stairway, star, start, status, stay, stock, stop, storage, storm, studio, study, sump, sun, switch, system, tamper, tank, task, telephone, television, temperature, test, thank_you, that, the, theater, thermostat, third, time, toggle, top, transformer, transmitter, trespassing, trouble, turn, twice, type, under, unit, unlocked, unoccupied, up, user, utility, vacation, valve, video, violated, visitor, wake_up, walk, wall, warehouse, warning, water, way, welcome, west, what, when, where, will, window, windows, with, work, yard, year, you, zone, zones*

