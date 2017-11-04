var express = require('express');
var app = express()
server = require('http').Server(app);
var io = require('socket.io').listen(server)
// var db = require('./mongo');
var bodyParser = require('body-parser');
var userObjects = {}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '1gb',
  extended: false
}));

server.listen(80)

console.log("server start")

app.get('/', (req, res) => {
  res.redirect("/main")
});

app.get('/main', (req, res) => { //메인 페이지
  res.sendfile(__dirname+"/mouse_click_move_test.html")
});
app.get('/game', (req, res) => {
  res.sendfile(__dirname + '/index.html')
});


app.get('/signup', (req, res) => { //회원가입창
  res.sendfile(__dirname + '/signup.html')
})

app.post('/aftersignup', (req, res) => { //회원가입 완료 후 확인창
  var userData = new db.Users({
    id: req.body.id,
    passwd: req.body.passwd
  });
  userData.save((err, result) => {
    if (err) return res.status(500).send("err");
    res.status(200).send("Succesful!");
    console.log(result);
  });
})

app.get('/signin', (req, res) => {
  res.sendfile(__dirname + '/login.html');
})
app.post('/signin', (req, res) => {zzzzzz
  db.Users.findOne({"id": req.body.id}, {__v: 0,_id: 0}, (err, result) => {
    console.log(result + " " + req.body.passwd)
    if (result.passwd === req.body.passwd)
    res.redirect("/main")
    else
    res.sendfile(__dirname + '/login_failed.html');
  });
})

app.get('/deleteall', (req, res) => { //전부 지우기
  db.Users.remove({}, (err, result) => {
    res.send("delete Succesful!\n" + result);
  })
});
app.get('/showall', (req, res) => { //전부 보여주기
  db.Users.find({}, {
    _id: 0,
    __v: 0
  }, (err, texts) => {
    if (texts) res.send(texts);
    else return res.status(404).send("text not found");
  });
});

class basicObject{
  constructor(width,height,x,y){
    this.width = width
    this.height = height
    this.x = x
    this.y = y
  }
}
class userObject extends basicObject{
  constructor(x,y,color){
    super(50,50,x,y)
    this.color = color
  }
}
io.on('connect', (socket) => {
  console.log("entered : "+socket.id);
  socket.on("onload",(data)=>{
    userObjects[socket.id] = new userObject(data.x,data.y,data.color)
  })
  socket.on("update",(data)=>{
    try{
    userObjects[socket.id].x = data.x
    userObjects[socket.id].y = data.y
    // console.log("update "+data.x)
  }
  catch(error){
    console.log("\n\n"+socket.id)
    console.log(userObjects)
    console.log(error+"\n\n")
  }
  })
  socket.on('disconnect', (data) => {
    delete userObjects[socket.id]
    io.emit('disconnect',socket.id)
    console.log('delete : '+socket.id);
  })
  // socket.on('room', (data) => {
  //   // var arr = Object.keys(io.sockets.connected)
  //   socket.broadcast.emit('room', data)
  // })
  setInterval(function() {
    // console.log(userObjects);
    io.emit('update',userObjects)
  },10)

})
