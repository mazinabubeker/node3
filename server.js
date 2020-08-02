var express = require('express');
var soccc = require('socket.io');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));
var io = soccc(server);
io.sockets.on('connection', newConnection)

var user_id = 0;

function newConnection(socket){
  console.log("Connected user: " + socket.id);
  socket.on('disconnect', ()=>{
    user_id--;
  });
  if(user_id == 0){
    socket.emit('execute_action', 0);
  }else{
    socket.emit('execute_action', 1);
    socket.on('new_rotation', val=>{
      socket.broadcast.emit('update_rotation', val);
    })
  }
  user_id++;
}