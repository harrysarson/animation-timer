var animate = require('../index.js');

var x = 0;

var controller = animate();

controller
    .once('animate', function(data){
        for(var i = 0; i < 1e6; ++i){
            ++x;
        }
        $('#fps').html(x);
        
    })
    .on('animate', function(data){
        
        $('#output').text('time = ' + data.deltatime);
        
        $('#fps').html('<div>Weighted fps = ' + data.fps + ', actual = ' +  1000/data.deltatime  + '</div>' + $('#fps').html());
        
        
        if(data.count === 100)
            controller.stop();
    })
    .start();