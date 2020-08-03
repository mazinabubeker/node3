var socket = io();
var x_pos = 600;
var x_pos_2 = 600;

var realrot = 0;

var type = 0;
var uid = 0;

var leftscore = 0;
var rightscore = 0;

socket.on('start', client_id=>{
  if(client_id==0){startGame()}else{startController()}
  type = client_id;
});

socket.on('new_id', id=>{
  uid=id;
});
    
$(window).ready(function(){     
  
});

function startGame(){
  var cnv = createCanvas(1200, 800);
  cnv.position(innerWidth/2 - 600, innerHeight/2 - 400);
  document.querySelector('html').classList.add('visible');
  rectMode(CENTER);
  socket.on('new_rot_resp', rot=>{
    if(rot.id==0){
      x_pos = rot.rot;
    }else{
      x_pos_2 = rot.rot;
    }
  });

  socket.on('new_ball_pos', pos=>{
    ball.x = pos.x;
    ball.y = pos.y;
  });

  socket.on('update_score', val=>{
    leftscore = val.l;
    rightscore = val.r;
    document.getElementById('status').innerHTML = leftscore + "<br>" + rightscore;
  });

  // socket.on('new_opp_rot', rot=>{
  //     data2 = clamp((rot-180)/32, -1, 1);
  //     data2 = (data2 + 1)/2;
  //     x_pos_2 = data2*1060 + 70;
  //     console.log("errrasdsdadr");
  // });
  
}

function startController(){
  document.body.style.backgroundColor = "black";
  document.body.innerHTML = 'Hire me please';
  document.body.onclick = startRequest;
}

function startRequest(){
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          // User accepted
          runOrientationListener();
        }
      })
      .catch(e=>{
        // User declined
        console.log("Declined");
      });
    } else {
      // Has access
      runOrientationListener();
    }
}

function runOrientationListener(){
  window.addEventListener('deviceorientation', (event) => {
    let newY = Math.round(event.beta+180);
    if(newY == realrot){return;}
    realrot = newY;
    socket.emit('new_rot', {rot: newY, id: uid});
  });
}



// function setup(){
  
// }

function draw(){
  background(255);
  fill(0);
  
  rect(x_pos, 740, 140, 20);
  rect(x_pos_2, 60, 140, 20);
  
  circle(ball.x, ball.y, 30, 30)

}

var ball = {x: 600, y: 400}

