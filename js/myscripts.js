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

function ball() {
    this.originalRadius = Math.random() * 35 + 25;
    this.radius = this.originalRadius;
    this.x = (Math.random() * (window.innerWidth - 100)) + 50;
    this.y = (Math.random() * (window.innerHeight - 100)) + 50;
    this.dirX = Math.round(Math.random() * 10) + 0.5;
    this.dirY = Math.round(Math.random() * 10) + 0.5;
    this.opa = Math.random() * 0.5 + 0.5;
    this.opaRef1 = 0.55;
    this.opaRef2 = 0.25;   
    this.bubbleColor = "rgba(187, 253, 255, " + this.opa + ")";
    this.largeReflectionColor = "rgba(255, 255, 255, " + this.opaRef1 + ")";
    this.smallReflectionColor = "rgba(255, 255, 255, " + this.opaRef2 + ")";
    this.popped = false;
    this.update = function() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        ctx.fillStyle = this.bubbleColor;
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x - (0.4 * this.radius) , this.y - (0.4 * this.radius) , 0.3 * this.radius  , 0 , Math.PI*2 , true);
        ctx.fillStyle = this.largeReflectionColor;
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (0.5 * this.radius) , this.y + (0.5 * this.radius) , 0.1 * this.radius  , 0 , Math.PI*2 , true);
        ctx.fillStyle = this.smallReflectionColor;
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
        if (balls[i].radius < 1.4 * balls[i].originalRadius) {
            if (balls[i].popped == true) {
                balls[i].radius *= 1.15;
            }
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
}

function deleteBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    for (var i = 0; i < balls.length; i++) {
        var topX = balls[i].x - balls[i].radius;
        var botX = balls[i].x + balls[i].radius;
        var leftY = balls[i].y - balls[i].radius;
        var rightY = balls[i].y + balls[i].radius;
        if (mouseX > topX && mouseX < botX && mouseY > leftY && mouseY < rightY) {
            balls[i].popped = true;
        }
    }
}