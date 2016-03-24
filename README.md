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


Creates a new animation controller which can be accessed through the call back or as a variable

### controller.on(event, handler)

Attaches the handler to 'event' so that when 'event' is emmitted handler will be called. Multiple handlers can be attached
to a single event. Returns the controller so calls can be chained. For a list of events produced by the controller during animation
[see contoller.emit](#controlleremitevent-data)

```javascript
animation.on('start', function(data){
    // ...
});
```

#### event

Type: `string`

Event to attach handler to

#### handler

Type: `function`

Function to be called when ever 'event' is emmitted

### controller.emit(event, data)

Emits 'event' and calls all handlers attached to that event passing `data` to each handler.
Returns the controller so calls can be chained.
During animation the following events will be emitted by the controller:

'start': emitted when animation starts. 

**Note** This will only be emitted if animation is not already running when controller.start() is called. 
controller.restart() will always cause 'start' to be emitted.

'animate': emitted once every frame, attach a handler to draw the frames of the animation.

'stop': emitted when animation stops. 

When an event is emitted by the controller the handler will be passed as the an object with these properties:

time: time in milliseconds since animation started in miliseconds (calls to start after animation is already running will NOT reset this).
deltatime: time since last frame in miliseconds.
count: integer representing number of times animate has been emitted by the controller (i.e. the number of frames).

**Note** This will only be emitted if animation is running when controller.stop() is called, 
controller.restart() will emit 'stop' if animation is running when the function is called.

```javascript
// emit custom event
controller.emit('user-input', {x: 45, y: 87});
```



 *          start(): function to start animation. **Note** If start is called when the animation 
 *              is already running the animation 'stop' event is not emitted. Returns controller for chaining.
 *
 *          restart(): stops animation ('stop' is emitted if (and only if) animation is running) then immediately
 *               restarts animation ('start' is emitted regardly of whether the animation was running preveously).
 *               Returns controller for chaining.
 *
 *          stop(): function to stop animation, note animation will not stop immediately,
 *              After animaion has stopped the 'stop' will be emitted provided animation was running before
 *              stop() was called. Returns controller for chaining.
 *
 *          minRefresh: positive number defining the minimum time in miliseconds required between frames, default value is 0
 *      
 *          animating: boolean indicating whether or not animation is running, cannot be modified
 *                           
 



