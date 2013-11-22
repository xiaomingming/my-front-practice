var emitter=require('events').EventEmitter;
var event=new emitter();
event.on('your_event',function(){
    console.log('you emitte this event');
});
setInterval(function(){
    event.emit('your_event');
},3000);