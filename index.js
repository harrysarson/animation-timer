
var now = require('performance-now');
require('requestanimationframe');

var Events = require('events');

var callable = function (fun) {
    return fun && fun.call;
};

/**
 * animation-timer module.
 * @module animation-timer
 */

/**
 * Creates an animation. The animation is controll through the controller object.
 *      The 'controller' obect has these properties:
 *
 *          on(event,callback): function that will call the callback function whenever the specified event is emitted,
 *              function can take one argument: the data object, see emit() for details. Returns controller for chaining.
 *
 *          once(event,callback): function that will call the callback function the first (and only the first) time the specified
 *              event in emitted. function can take one argument: the data object, see emit() for details. 
 *               Returns controller for chaining.                  
 *           
 *          emit(event,data): emits an event so that any callbacks attached to that event will be called.
 *              data is optional and any value given for data will be passed to any callbacks called.
 *              The following events are emitted automatically
 *                  'start': emitted when animation starts. **Note** This will only be emitted if
 *                      animation is not already running when the start() function is called. restart() will always cause
 *                      'start' to be emmited.
 *                  'animate': emitted once every frame, bind code to create animation to this event
 *                  'stop': emitted when amiation stops. **Note** This will only be emitted if animation
 *                      is running when stop() is called, restart() will emit 'stop' if animation is running
 *                      when restart is called.
 *               When an event is emitted automatically the callback will be passed as the data parameter an object with these properties:
 *                  time: time in milliseconds since animation started in miliseconds (calls to start after animation
 *                      is already running will NOT reset this)
 *                  deltatime: time since last frame in miliseconds
 *                  count: integer representing number of times animate has been emitted by the controller
 *               This function returns controller object for chaining.
 *
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
 *
 * @memberOf animation-timer
 *  @param {function} (optional) trigger Function that can be used to control animation. The first argument is the controller object
 *      
 *              
 * @returns {Object} Controller object
 * @example
 *
 * animate(function(controller){
 *       var car = { position: 0; }
 *       var speed = 0;
 *
 *       $(gas).mousedown(function(){
 *           speed = 0.1;
 *           controller.start();
 *       }).mouseup(function(){
 *           controller.stop();
 *       });
 *       $(break).mousedown(function(){
 *           speed = -0.1;
 *           controller.start();
 *       }).mouseup(function(){
 *           controller.stop();
 *       });
 *       controller.on('animate',function(event){
 *          var distance = speed * event.deltatime;
 *        
 *          car.position += distance;
 *       
 *          if(Math.abs(car.position) > 10)
 *              event.stop();
 *       });
 *  });
 *
 *  // alternatively
 *  var controller = animate();
 *  ...
 *
 */
module.exports = function animate(trigger) {
    'use strict';
    var cont = false,
        animating = false,
        restart = false,
        starttime = 0,
        minrefresh = 0,
        controller = new Events(),
        time = 0,
        deltatime = 0,
        count = 0,
        thisarg = {
            get time      () { return time; },
            get deltatime () { return deltatime; },
            get count     () { return count; }
        },
        a = function () {

            var lasttime = time;
            time = now() - starttime;
            deltatime = time - lasttime;
            
            if (cont) {
                requestAnimationFrame(a);
                if(minrefresh < thisarg.deltatime){
                    controller.emit('animate', thisarg);                    
                }else{
                    time = lasttime;
                }
            } else {
                animating = false;
                controller.emit('stop', thisarg);
                if (restart) {
                    restart = false;
                    start();
                }
            }
            
            count++;
        },
        start = function () {
            /* start animation */
            cont = animating = true;
            time = 0;
            deltatime = 0;
            count = 0;
            starttime = now();
            controller.emit('start', thisarg);
            requestAnimationFrame(a);
        };


    Object.defineProperties(controller,{
        animating: {
            configurable: true,
            get: function() { return animating; },
        },
        minRefresh: {
            configurable: true,
            get: function() { return minrefresh; },
            set: function(r) { 
                if(r !== undefined && r >= 0) minrefresh = r;
            }   
        }
    });
    
    controller.start = function () {
        if (!animating) { start(); }
        return controller;
    };
    
    controller.restart = function () {
        if (animating) {
            /* animation has been previously started and not
                yet stopped */
            restart = true;
            cont    = false;
        } else {
            start();
        }
        return controller;
    };
    
    controller.stop = function () {
        cont = false;
        return controller;
    };
    
    if (callable(trigger))
        trigger.call(undefined, controller);
    
    return controller;
};