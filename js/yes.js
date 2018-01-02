;(function() {
  'use strict';
  
  var c = document.getElementById('c');
  var ctx = c.getContext('2d');
  var w = c.width = window.innerWidth;
  var h = c.height = window.innerHeight;
  var cx = w / 2;
  var cy = h / 2;
  var mx = null, my = null;
  
  c.addEventListener('mousemove', function(e) {
    var r = c.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  
  function Camera(x, y) {
    this.x = x;
    this.y = y;
    this.w = w * 2;
    this.h = 0;
    this.th = h * 2;
  }
  
  Camera.prototype = {
    constructor: Camera,
    update: function() {
      if(mx !== null && my !== null) {
        this.x += (mx - this.x) * 0.04;
        this.y += (my - this.y) * 0.04;
      }
      this.h += (this.th - this.h) * 0.04;
    },
    render: function(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-atop';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
      ctx.restore();
    }
  };
  
  function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 10;
    this.or = this.r;
    this.a = Math.random() * 360;
    this.vx = Math.random() * 10;
    this.vy = Math.random() * 0.2 - 0.1;
    this.ax = 0;
    this.ay = 0;
    this.s = 0.01;
  }
  Circle.prototype = {
    update: function() {
      
      this.a += Math.random() * 50 - 25;
      var rr = this.a * Math.PI / 180;
      
      this.ax = Math.cos(rr) * this.s;
      this.ay = Math.sin(rr) * this.s;
      this.vx += this.ax;
      this.vy += this.ay;
      this.x += this.vx;
      this.y += this.vy;
      
      this.r = this.or + Math.cos(rr) * (this.or  * 0.5);
      
      if(this.x > w) {
        this.x = 0;
        this.vx = 0;
      } else if(this.x < 0) {
        this.x = w;
        this.vx = 0;
      }
      
      if(this.y > h) {
        this.y = 0;
        this.vy = 0;
      } else if(this.y < 0) {
        this.y = h;
        this.vy = 0;
      }
      

      
      
    },
    render: function(ctx, cam) {
      
      var dx = this.x - cam.x;
      var dy = this.y - cam.y;
      
      ctx.save();
      ctx.fillStyle = 'hsl(' + (Math.random() * 360) + ',100%, 50%)';
      ctx.beginPath();
      ctx.translate(this.x + dx, this.y + dy);
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
  
  var displayList = [];
  var circle;
  var cam = new Camera(cx, cy);
  var max = 500;
  for(var i = 0; i < max; i++) {
      circle = new Circle(
        cx,
        cy
      );
      displayList.push(circle);
  }

  
  requestAnimationFrame(function loop() {
    
    requestAnimationFrame(loop);
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    
    ctx.globalCompositeOperation = 'lighter';
            
    for(var i = 0; i < displayList.length; i++) {
      circle = displayList[i];
      circle.update();
      circle.render(ctx, cam);
    }
    
    cam.update();
    cam.render(ctx);
    
    
  });
  
})();