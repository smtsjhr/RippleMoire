
var fold = 16;
var scale = 3;
var num_ripples = 20;
var separation = 200;
var thickness = 1;
var space = 20;

var time = 0;
var rate = 200;
var color_rate = 10;
var separation_rate = 4*rate;
var space_rate = .8*rate;

var alpha = 0.05;
var get_mouse_pos = false;
var get_touch_pos = false;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var stop = false;

var fps, fpsInterval, startTime, now, then, elapsed;



startAnimating(30);


function draw() {
  
  let dpr = window.devicePixelRatio || 1;

  let W = canvas.style.width =  window.innerWidth;
  let H = canvas.style.height =  window.innerHeight;
  
  
  var hue = (time/color_rate + 250)%360;
  ctx.fillStyle = `hsla(${hue}, 100%, 30%, ${alpha})`;
  ctx.fillRect(0,0, W, H);
  

  ripples(ctx, 0.5*W, 0.5*H, scale*dpr, fold, separation, thickness, space, num_ripples, -time/rate);
  
  time += 1;
    
  
}



function ripples(ctx, x_origin, y_origin, scale, fold, separation, thickness, space, ripples, time) {
  
  ctx.save();
  ctx.translate(x_origin, y_origin);
  ctx.scale(scale,scale);
  for (let f = 0; f < fold; f++) {
    ctx.save();
    ctx.rotate(2*Math.PI*f/fold);
    for (let i = 0; i < ripples; i++) {
      ctx.save();
      ctx.lineWidth = thickness;
      if (i === ripples - 1 ) { 
            line_alpha = (time%1)**2;
      } 
      else {
            line_alpha = 1;
      }
      ctx.strokeStyle = 'rgba(0,0,0,' + line_alpha.toString() + ')';
      ctx.beginPath();
      ctx.arc(separation, 0, space*(1+i + time%1) , 0, 2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}


function startAnimating(fps) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
    
  window.addEventListener("resize", checkResize, false);
  fpsInterval = 1000 / fps;
  then = window.performance.now();
  startTime = then;
  
  animate();
}


function animate(newtime) {

  if (stop) {
      return;
  }

  requestAnimationFrame(animate);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
  }
  
  canvas.addEventListener('mousedown', e => {
  get_mouse_pos = true;
  getMousePosition(canvas, e)
  alpha = 0.3;
  });
    
  canvas.addEventListener('mouseup', e => {
  get_mouse_pos = false;
  alpha = 0.05
  });

  canvas.addEventListener('mousemove', function(e) {
    if(get_mouse_pos) {
      getMousePosition(canvas, e)
    }
  })
  
  canvas.addEventListener('touchstart', function(e) {
      getTouchPosition(canvas,e);
      event.preventDefault();
      alpha = 0.3;
  }, false);
    
  canvas.addEventListener('touchend', function(e) {
     alpha = 0.05;
  }, false);
    
  canvas.addEventListener('touchmove', function(e) {
      getTouchPosition(canvas,e);
      event.preventDefault();
  }, false);
    

   
   draw();
    
  
}

var checkResize = function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

var previousOrientation = window.orientation;
var checkOrientation = function(){
if(window.orientation !== previousOrientation){
  previousOrientation = window.orientation;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
checkResize();
};


function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  separation = 50+ 200*x/canvas.width;
  space = 10 + 30*y/canvas.height;
}

function getTouchPosition(canvas, event) {
  var touch = event.touches[0];
  const rect = canvas.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  
  separation = 50+ 200*x/canvas.width;
  space = 10 + 30*y/canvas.height;
}
