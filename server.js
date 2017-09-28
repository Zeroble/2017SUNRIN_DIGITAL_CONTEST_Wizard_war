var express = require('express');
var app = express()
server = require('http').Server(app);
var io = require('socket.io').listen(server)
var db = require('./mongo');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '1gb', extended: false }));

server.listen(80)

console.log("server start")

app.get('/',(req,res)=>{
  console.log("connected");
  res.sendfile(__dirname+'/index.html')
});

io.on('connect',(socket)=>{
  socket.on('room',(data)=>{
    console.log(data)
    // var arr = Object.keys(io.sockets.connected)
    socket.broadcast.emit('room',data)
  })
})

app.get('/signup',(req,res)=>{//회원가입창
  res.sendfile(__dirname+'/signup.html')
})

app.post('/aftersignup',(req,res)=>{//회원가입 완료 후 확인창
  var userData = new db.Users({
    id: req.body.id,
    passwd : req.body.passwd
  });
  userData.save((err, result)=>{
    if(err) return res.status(500).send("err");
    res.status(200).send("Succesful!");
    console.log(result);
  });
})

app.get('/signin',(req,res)=>{
  res.render(__dirname+'/login.ejs',{id:" "});
})
app.post('/signin',(req,res)=>{
  res.render(__dirname+'/login.ejs',{id : req.body.id});
})
app.get('/deleteall', (req, res)=>{ //전부 지우기
  db.Users.remove({},(err,result)=>{
  res.send("delete Succesful!\n"+result);
  })
});
app.get('/showall',(req,res)=>{//전부 보여주기
  db.Users.find({} ,{_id : 0,__v:0},(err,texts)=>{
    if(texts) res.send(texts);
    else return res.status(404).send("text not found");
  });
});
