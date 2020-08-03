var express = require('express');
var soccc = require('socket.io');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));
var io = soccc(server);
io.sockets.on('connection', newConnection)

var uid = 0;
var upd = 0;

var p1l = 600;
var p2l = 600;

var leftscore = 0;
var rightscore = 0;

var ball = {x: 600, y: 400, dx: 0, dy: 0};

var totalppl = 0;

function newConnection(socket){
  totalppl++;
  socket.on('disconnect', ()=>{
    totalppl--;
    if(totalppl == 0){
      uid = 0;
      upd = 0;
      leftscore = 0;
      rightscore = 0;
      ball.x = 600;
      ball.y = 400;
      ball.dx = 0;
      ball.dy = 0;
      p1l = 600;
      p2l = 600;
    }
  });
  socket.emit('new_id', uid);
  console.log("Connected user: " + socket.id);
  let id_str = Math.floor(uid/2).toString();
  if(upd==0){
    upd=1
    socket.join('listeners');
    socket.emit('start', 0);
  }else{
    upd=0
    if(uid==0){
      setTimeout(()=>{
        ball.dy = -1;
      },1000);
    }
    socket.emit('start', 1);
    socket.on('new_rot', rot=>{
      let new_pos = clamp((rot.rot-180)/32, -1, 1);
      new_pos = (new_pos + 1)/2;
      new_pos = new_pos*1060 + 70;
      if(rot.id == 0){p1l = new_pos;}else{p2l = new_pos;}
      io.in('listeners').emit('new_rot_resp', {rot: new_pos, id: rot.id});
    });
    uid+=1;
  }
  
  // if(uid==4){
  //   addListeners();
  // }

  // HANDLE JOINING AND SENDING EACHOTHER GARBAGE. :(
}
// function addListeners(){
//   socs[0].on('new_rot', rot=>{
//     locs[0].emit('new_rot', rot);
//     locs[1].emit('new_opp_rot', rot);
//     console.log('hi?');
//   })

//   socs[1].on('new_rot', rot=>{
//     locs[1].emit('new_rot', rot);
//     locs[0].emit('new_opp_rot', rot);
//   })
// }

// function opposite(x){
//   if(x==1){
//     return 0;
//   }else{
//     return 1;
//   }
// }

function eventLoop(){
  setTimeout(()=>{
    if(ball.y > 710){
      let dist = Math.abs(ball.x-p1l);
      console.log("me" + " " + p1l + ' ' + ball.x);
      if(dist <= 90){
        ball.dy = -ball.dy;
        ball.dx = (ball.x-p1l)/25;
      }else{
        leftscore++;
        io.in('listeners').emit('update_score', {l: leftscore, r: rightscore});
        ball.x = 600;
        ball.y = 400;
        ball.dx = 0;
        ball.dy = 0;
        setTimeout(()=>{
          ball.dy = -1;
        }, 1000);
      }
    }else if(ball.y < 90){
      let dist = Math.abs(ball.x-p2l);
      console.log("me" + " " + p2l + ' ' + ball.x);
      if(dist <= 90){
        ball.dy = -ball.dy;
        
        ball.dx = (ball.x-p2l)/25;
      }else{
        rightscore++;
        io.in('listeners').emit('update_score', {l: leftscore, r: rightscore});
        ball.x = 600;
        ball.y = 400;
        ball.dx = 0;
        ball.dy = 0;
        setTimeout(()=>{
          ball.dy = 1;
        }, 1000);
      }
    }
  
    if(ball.x < 15 || ball.x > 1185){
      ball.dx = -ball.dx;
    }
    ball.x += ball.dx*6;
    ball.y += ball.dy*6;
    io.in('listeners').emit('new_ball_pos', {x: ball.x, y: ball.y});
    eventLoop();
  },33);
}

eventLoop();

function clamp(num, min, max){
  if(num > min && num < max){
    return num;
  }else if(num <= min){
    return min;
  }else{
    return max;
  }
}