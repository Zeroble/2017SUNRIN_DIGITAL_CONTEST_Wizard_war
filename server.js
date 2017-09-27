var express = require('express');
var app = express()
server = require('http').Server(app);
var io = require('socket.io').listen(server)
server.listen(80)

app.get('/',(req,res)=>{
  console.log("connected");
  res.sendfile(__dirname+'/index.html')
});

io.on('connect',(socket)=>{
  socket.on('room',(data)=>{
    console.log(data)
    var arr = Object.keys(io.sockets.connected)
    socket.broadcast.emit('room',data)
  })
})
