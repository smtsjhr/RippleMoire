let enable_interaction = true;
let get_mouse_pos = false;
let get_touch_pos = false;

let W;
let H;
let dpr = window.devicePixelRatio || 1;

let fold = 16;
let scale = 3;
let num_ripples = 20;
let separation = 200;
let thickness = 1;
let space = 20;
let alpha = 0.05;

let time = 0;
let rate = 200;
let color_rate = 10;
let separation_rate = 4*rate;
let space_rate = .8*rate;

var fps = 30;
var dt, startTime, now, then, delta;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function draw() {
  let hue = (time/color_rate + 250)%360;
  ctx.fillStyle = `hsla(${hue}, 100%, 30%, ${alpha})`;
  ctx.fillRect(0,0, W, H);
  ripples(0.5*W, 0.5*H, scale*1, fold, separation, thickness, space, num_ripples, -time/rate);
  time += 1/dpr;
}

function ripples(x_origin, y_origin, scale, fold, separation, thickness, space, ripples, time) {
  ctx.save();
  ctx.translate(x_origin, y_origin);
  ctx.scale(scale,scale);
  for (let f = 0; f < fold; f++) {
    ctx.save();
    ctx.rotate(2*Math.PI*f/fold);
    ctx.lineWidth = thickness;
    for (let i = 0; i < ripples; i++) {
      ctx.save();
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

function animate(fps) {
  dt = 1000 / fps;
  then = window.performance.now();
  startTime = then;  
  throttle();
}

function throttle(newtime) {
  requestAnimationFrame(throttle);
  now = newtime;
  delta = now - then;
  if (delta > dt) {
      then = now - (delta % dt);
      draw();
  }  
}

if (enable_interaction) {
  canvas.addEventListener('mousedown', e => {
    get_mouse_pos = true;
    interaction(e)
    alpha = 0.3;
  });
  canvas.addEventListener('mouseup', e => {
    get_mouse_pos = false;
    alpha = 0.05
  });
  canvas.addEventListener('mousemove', e => {
    if(get_mouse_pos) {
      interaction(e)
    }
  })
  canvas.addEventListener('touchstart', e => {
      let touch = e.touches[0];
      interaction(touch);
      e.preventDefault();
      alpha = 0.3;
  }, false);
  canvas.addEventListener('touchend', e => {
     alpha = 0.05;
  }, false);
  canvas.addEventListener('touchmove', e => {
      let touch = e.touches[0];
      interaction(touch);
      e.preventDefault();
  }, false);

}

function interaction(event) {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left
  let y = event.clientY - rect.top
  separation = 50+ 150*x/canvas.width;
  space = 10 + 20*y/canvas.height;
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

window.onresize = function() {
  resize();
}

resize();

animate(fps);