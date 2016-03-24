# animation-timer

JavaScript module which provides timing structure required for simple animations.

This module works in both the browser and nodejs and can be used to create smooth animations.

## Installation

```bash
$ npm install animation-timer
```

## Usage

Animations can either be contained in a callback where the controller object
is passed to the function or controlled using the 
object returned by the function (or both in tandem)

```javascript

var animate = require('animation-timer');

animate(function(controller) {
    // ...
});
// alternatively
var controller = animate();
// ...
 
```

The animation is managed using events and handlers

```javascript

var car = { position: 0; }
var speed = 0;

$('.gas').mousedown(function() {

    speed = 0.1;
    controller.start();
    
}).mouseup(function(){

    speed = 0.0;
    
});

$('.break').mousedown(function() {

    speed = 0;
    
});

$('.pause').mousedown(function() {

    controller.stop();
    
});



controller.on('animate',function(event){
    var distance = speedevent.deltatime;

    car.position += distance;

    if(Math.abs(car.position) > 10)
        event.stop();
});
  
```

## API

### animation

```javascript
let controller = animation(function(controller){

});
```

### controller.minRefresh = 0

Type: (number)

Minimum time in milliseconds between frames

### controller.animating -readonly-

Type: (boolean)

Readonly flag indicating whether the animation is running.

### controller.on(event, handler)

Attaches the handler to `event` so that when `event` is emitted handler will be called. Multiple handlers can be attached
to a single event. For a list of events produced by the controller during animation
[see contoller.emit](#controlleremitevent-data).


#### Arguments

1. `event` (string): Event to attach handler to.

2. `handler` (`function`): Function to be called when `event` is emmitted

#### Returns
(Object): Return `controller` so calls can be chained. 


#### Example

```javascript
animation.on('start', function(data){
    // ...
});
```

### controller.emit(event, [data])

Emits 'event' and calls all handlers attached to that event passing `data` to each handler.
Returns the controller so calls can be chained.
During animation the following events will be emitted by the controller:

**'start':** Emitted when animation starts. 'start' will only be emitted if animation is not already running when `controller.start()` is called. 
`controller.restart()` will always cause 'start' to be emitted.

**'animate'**: Emitted once every frame, attach a handler to draw the frames of the animation.

**'stop'**: Emitted when animation stops, due to `controller.stop()` or `controller.restart()` being called whilst animation is running. 

When an event is emitted by the controller the handler will be passed as the an object with these properties:

* **time** Milliseconds since animation started in (calls to start after animation is already running will not reset this).
* **deltatime** Milliseconds between last frame and this frame.
* **count** Number of times the event 'animate' has been emitted by the controller (i.e. the number of frames).



#### Arguments

1. `event` (string): Event to emit

2. `[data = {}]` (Object): Data to send to the handler

#### Returns

(Object): Return `controller` so calls can be chained. 


#### Example

```javascript
// emit custom event
controller.emit('user-input', {x: 45, y: 87});
```

### controller.start()

Start animation. 

**Note** If `controller.start` is called when the animation is already running then the 'start' event is not emitted. 

#### Returns

(Object): Return `controller` so calls can be chained. 


#### Example

```javascript
// bind handler to animation
controller.on('animation',function(data){
	// render frame
});

controller.start();
```

### controller.stop()

Stop animation. 

**Note** If `controller.start` is called when the animation is already running then the 'start' event is not emitted. 

#### Returns

(Object): Return `controller` so calls can be chained. 


#### Example

```javascript
// bind handler to end of animation
controller.on('stop',function(data){
	
    console.log("There were " + data.count + " frames");
    
});

controller.stop();
```

### controller.restart()

Stop animation (if it was previously running) and then start it. 

**Note** If animation was previously running then 'stop' event will be emitted and then, regardless of previous state, 'start' will be emitted.

#### Returns

(Object): Return `controller` so calls can be chained. 


#### Example

```javascript
// bind handler to begining of animation
controller.on('start',function(data){
	
    console.log("Animation starting");
    
});
// bind handler to end of animation
controller.on('stop',function(data){
	
    console.log("There were " + data.count + " frames");
    
});

controler.start();

// ... pause

controller.restart(); // both handlers will run
```               
 



