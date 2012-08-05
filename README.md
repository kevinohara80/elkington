# elkington

**elkington** is a node.js module for interfacing with the Elk M1 Gold automation controller. 

**This is currently experimental and under development. Not all Elk commands are available**

## Features

* Simple API with function calls for Elk commands
* Supports many Elk commands
* Supports both secure and non-secure communication ports

## Usage

To get started, call `createConnection()` to create a new connection and register some event handlers:

```javascript
var elkington = require('elkington');

/// create a connection
var elk = elkington.createConnection({ 
  port: 2101, 
  host: '192.168.1.13' 
});

// register event handlers
elk.on('any', function(msg){
  console.log('Incoming message: ' + msg.message);
});
```

Or a secure connection can be established...

```javascript
/// create a connection
var elk = elkington.createConnection({ 
  port: 2601, 
  host: 'myelk.myhouse.com',
  username: 'somebody',
  password: 'yoyoyo',
  useSecure: true 
});
```

### Handling events

**elkington** provides a lot of commands. Some of the commands will invoke a response from the controller. You can optionally pass in a callback to these commands.

```javascript
elk.alarmByZoneRequest(function(err, resp){
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
elk.on('AZ', function(msg) {
  console.log('area1 arm status: ' + msg.data.area1.armStatus);
});

elk.alarmByZoneRequest();
```

### Speaking

The Elk M1 has a large library of words that it can say over it's speaker. With the **elkington** `speak()` function, you can make your Elk say all kinds of wacky (or useful) stuff...

```javascript
elk.speak('defective hottub pump');
```

...now something more useful:

```javascript
var elkington = require('elkington');
var request = require('request');
var elk = elkington.createConnection({ port: 2101 , host: '192.168.1.13'});

elk.on('connect', function() {
  
  // say the outside temp on connection to the Elk
  var opts = {
    url: 'http://query.yahooapis.com/v1/public/yql',
    qs: {
      q: 'select item from weather.forecast where location = "48307"',
      format: 'json'
    }
  };
  
  request(opts, function(error, response, body) {
    if(!error) {
      var temp = JSON.parse(body).query.results.channel.item.condition.temp.toString();    
      elk.speak('outside temperature is ' + temp + ' degrees');
    }
  });
  
}); 
```

The speak function can even interpret numerical values

```javascript
// speaker says 'two thousand twelve'
elk.speak('2012');
```

## Event API

### on(event, callback) 

Register an event listener.

## Arm/Disarm API

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

### armVacation([options])

Arm the Elk in Vacation Mode.

### armStepAway([options])

Arm and step to next Away mode

### armStepStay([options])

Arm and step to next Stay mode

### armingStatusRequest([callback])

Request the arming statuses for all areas. Callback is optional. The callback returns the results of the Arming Status Response sent by the Elk.

## Events

**elkington** can emit the following events. With the exception of the utility `any` event, the events use the same two-character, uppercase codes from the Elk RS-232 ASCII protocol:

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

## Words

The **elkington** `speak()` function supports the following words:

*custom1, custom2, custom3, custom4, custom5, custom6, custom7, custom8, custom9, custom10, zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, hundred, thousand, silence200ms, silence500ms, tone800hz, a, access, acknowledged, ac_power, activate, activated, active, adjust, air, alarm, alert, all, am, an, and, answer, any, are, area, arm, armed, at, attic, audio, auto, authorized, automatic, automation, auxiliary, away, b, back, barn, basement, bathroom, battery, bedroom, been, bell, bottom, break, breakfast, bright, building, burglar, button, by, bypassed, cabinet, call, camera, cancel, carbon_monoxide, card, center, central, change, check, chime, circuit, clear, closed, closet, code, cold, condition, connect, control, cool, cooling, corner, crawlspace, danger, day, deck, decrease, defective, degrees, delay, den, denied, detected, detector, device, dial, dialing, dim, dining_room, disable, disarm, disarmed, dock, door, doors, down, driveway, east, emergency, enable, end, energy, enrollment, enter, entering, entertainment, enter_the, entry, environment, equipment, error, evacuate, event, exercise, expander, exit, exterior, f, fail, failure, family_room, fan, feed, fence, fire, first, flood, floor, followed, force, fountain, foyer, freeze, front, full, furnace, fuse, game, garage, gas, gate, glass, go, good, goodbye, great, group, guest, gun, hall, hallway, hanging_up, hang_up, has, has_expired, have, hear_menu_options, heat, help, high, hold, home, hot, hottub, house, humidity, hvac, if, immediately, in, inches, increase, inner, input, inside, instant, interior, in_the, intruder, intruder_message, intrusion, invalid, is, is_about_to_expire, is_active, is_armed, is_canceled, is_closed, is_disarmed, is_low, is_off, is_ok, is_on, is_open, jacuzzi, jewelry, keep, key, keypad, kitchen, lamp, laundry, lawn, leak, leave, left, less, level, library, light, lights, line, living_room, loading, lobby, location, lock, low, lower, m, machine, mail, main, mains, manual, master, max, media, medical, medicine, memory, menu, message, middle, minute, missing, mode, module, monitor, more, motion, motor, next, night, no, normal, north, not, notified, now, number, nursery, of, off, office, oh, ok, on, online, only, open, operating, option, or, other, out, outlet, output, outside, over, overhead, panel, panic, parking, partition, patio, pause, perimeter, personal, phone, place, play, please, plus, pm, police, pool, porch, port, pound, pounds, power, press, pressure, problem, program, protected, pump, radio, raise, ready, rear, receiver, record, recreation, relay, remain_calm, remote, repeat, report, reporting, reset, restored, return, right, roof, room, running, safe, save, screen, second, secure, security, select, sensor, serial, service, set, setback, setpoint, setting, shed, shipping, shock, shop, shorted, shunted, side, silence, siren, sliding, smoke, someone, south, spare, speaker, sprinkler, stairs, stairway, star, start, status, stay, stock, stop, storage, storm, studio, study, sump, sun, switch, system, tamper, tank, task, telephone, television, temperature, test, thank_you, that, the, theater, thermostat, third, time, toggle, top, transformer, transmitter, trespassing, trouble, turn, twice, type, under, unit, unlocked, unoccupied, up, user, utility, vacation, valve, video, violated, visitor, wake_up, walk, wall, warehouse, warning, water, way, welcome, west, what, when, where, will, window, windows, with, work, yard, year, you, zone, zones*

## Todo

- Oh, man. Where do I start.

