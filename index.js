
var now = require('performance-now');
require('requestanimationframe');

var Events = require('events');

var callable = function (fun) {
    return fun && fun.call;
};

/**
 * animation-timer module.
 *
 * @see {README.md}
 * @module animation-timer
 */

module.exports = function animate(trigger) {
    'use strict';
    var cont        = false,
        animating   = false,
        restart     = false,
        starttime   = 0,
        minrefresh  = 0,
        controller  = new Events(),
        time        = 0,
        deltatime   = 0,
        count       = 0,
        fpsSmooth   = 0.9,
        fps         = 0, // waited mean average
        dataObj     = {
            get time      () { return time; },
            get deltatime () { return deltatime; },
            get count     () { return count; },
            get fps       () { return fps; }
        },
        a = function () {

            var smooth      = Math.min(1, count / 5) * fpsSmooth,
                lasttime    = time;
                
            time            = now() - starttime;
            deltatime       = time - lasttime;
            fps             = fps * smooth + (1 - smooth) / (deltatime / 1000);
            
            if (cont) {
                requestAnimationFrame(a);
                if(minrefresh < dataObj.deltatime){
                    controller.emit('animate', dataObj);                    
                }else{
                    time = lasttime;
                }
            } else {
                animating = false;
                controller.emit('stop', dataObj);
                if (restart) {
                    restart = false;
                    start();
                }
            }
            
            count++;
        },
        start = function () {
            /* start animation */
            cont        = animating = true;
            time        = 0;
            deltatime   = 0;
            count       = 0;
            fps         = 0; // start value, seems resonable
            starttime   = now();
            controller.emit('start', dataObj);
            requestAnimationFrame(a);
        };


    Object.defineProperties(controller,{
        animating: {
            configurable: true,
            get: function() { return animating; },
        },
        data: {
            configurable: true,
            get: function() { return dataObj; },
        },
        fpsSmoothingCoefficient: {
            configurable: true,
            get: function() { return fpsSmooth },
            set: function(d) { 
                if(!isNaN(d) && 0 < d && d < 1) fpsSmooth = d;
            },
        },
        minRefresh: {
            configurable: true,
            get: function() { return minrefresh; },
            set: function(r) { 
                if(!isNaN(r) && r >= 0) minrefresh = r;
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