var animate = require('../index.js');

animate()
    .on('animate', function(data){
        
        $('#output').text('Average fps = ' + data.count/data.time);
        
    })
    .start();