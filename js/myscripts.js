window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousedown', deleteBubble);

function letsStart() {
    myCanvas = document.getElementById("canvas");
    myOverlay = document.getElementById("overlay");
    myFlexboxControls = document.getElementById("flexbox-controls");
    myFlexboxStartButton = document.getElementById("flexbox-start-button");
    ctx = myCanvas.getContext("2d");
    resizeCanvas();
    setInterval(makeThemMove,25);
}

function resizeCanvas() {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;
    myFlexboxControls.style.height = window.innerHeight + "px";
    myFlexboxStartButton.style.width = window.innerWidth + "px";
}

/*var x = 20;
var y = 20;
var dirx = 4;
var diry = 7;*/

/*function draw() {
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    ctx.beginPath();
    ctx.fillStyle="#ccff33";
    ctx.arc(x,y,20,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
    if (x < 20 || x > myCanvas.width - 20) {
        dirx = -dirx;
    }
    if (y < 20 || y > myCanvas.height - 20) {
        diry = -diry;
    }
    if (x > myCanvas.width) {
        x = myCanvas.width;
    }
    if (y > myCanvas.height) {
        y = myCanvas.height;
    }
    x += dirx;
    y += diry;
}*/



function ball() {
    this.radius = Math.random() * 35 + 20;
    this.x = (Math.random() * (window.innerWidth - 100)) + 50;
    this.y = (Math.random() * (window.innerHeight - 100)) + 50;
    this.dirX = Math.round(Math.random() * 10) + 0.5;
    this.dirY = Math.round(Math.random() * 10) + 0.5;
    this.opa = Math.random() * 0.5 + 0.5;
    this.update = function() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        ctx.fillStyle = "rgba(187, 253, 255, " + this.opa + ")";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x - (0.4 * this.radius) , this.y - (0.4 * this.radius) , 0.3 * this.radius  , 0 , Math.PI*2 , true);
        ctx.fillStyle = "rgba(255, 255, 255, 0.55";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (0.5 * this.radius) , this.y + (0.5 * this.radius) , 0.1 * this.radius  , 0 , Math.PI*2 , true);
        ctx.fillStyle = "rgba(255, 255, 255, 0.25";
        ctx.closePath();
        ctx.fill();
    }
}

var balls = [];

document.getElementById("start-button-itself").onclick = function() {
    balls.push(new ball())
}

function makeThemMove() {
    resizeCanvas();
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    for (var i = 0; i < balls.length; i++) {
        balls[i].update();
        if (balls[i].x < balls[i].radius || balls[i].x > myCanvas.width - balls[i].radius) {
            balls[i].dirX = -balls[i].dirX;
        }
        if (balls[i].y < balls[i].radius || balls[i].y > myCanvas.height - balls[i].radius) {
            balls[i].dirY = -balls[i].dirY;
        }
        if (balls[i].x > myCanvas.width) {
            balls[i].x = myCanvas.width - 150;
        }
        if (balls[i].y > myCanvas.height) {
            balls[i].y = myCanvas.height - 150;
        }
        balls[i].x += balls[i].dirX;
        balls[i].y += balls[i].dirY;
    }
}

function deleteBubble(event) {
    console.log("ClientX: " + event.clientX);
    console.log("ClientY: " + event.clientY);
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    console.log("MouseX: " + mouseX + ", mouseY: " + mouseY);
    for (var i = 0; i < balls.length; i++) {
        console.log("Balls[ " + i + "] x and y: " + balls[i].x + " and " + balls[i].y);
    }
}