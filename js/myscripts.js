function letsStart() {
    declareVariables();
    resizeScreen();
    prepareMenu();
    setCurrentTool();
    createEventListeners();
    setInterval(makeThemMove,25);
}

function declareVariables() {
    myCanvas = document.getElementById("canvas");
    ctx = myCanvas.getContext("2d");
    myOverlay = document.getElementById("overlay");
    myInstructions = document.getElementById("instructions");
    myFlexboxControls = document.getElementById("flexbox-controls");
    blowBubbleButton = document.getElementById("blow-bubbles");
    popBubbleButton = document.getElementById("pop-bubbles");
    bubbles = [];
    currentTool = 0;
}

function resizeScreen() {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;
    myInstructions.style.width = window.innerWidth + "px";
    myFlexboxControls.style.height = 0.9 * window.innerHeight + "px";
}

function prepareMenu() {
    var buttons = document.getElementsByClassName("controls");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            var current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }       
            this.className += " active";
        })
    }
}

function setCurrentTool() {
    document.getElementById("blow-bubbles").onclick = function() {
        currentTool = 0;
    }   
    document.getElementById("pop-bubbles").onclick = function() {
        currentTool = 1;
    }
}

function createEventListeners() {
    window.addEventListener('resize', resizeScreen);
    window.addEventListener('mousedown', mouseDownCurrentTool);
    window.addEventListener('mouseup', mouseUpCurrentTool);
}

function mouseDownCurrentTool(event) {
    switch (currentTool) {
        case 0:
            blowBubble(event);
            break;
        case 1:
            deleteBubble(event);
            break;
    }
}

function mouseUpCurrentTool(event) {
    switch (currentTool) {
        case 0:
            releaseBubble(event);
            break;
    }
}

function deleteBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    for (var i = 0; i < bubbles.length; i++) {
        var topX = bubbles[i].x - bubbles[i].radius;
        var botX = bubbles[i].x + bubbles[i].radius;
        var leftY = bubbles[i].y - bubbles[i].radius;
        var rightY = bubbles[i].y + bubbles[i].radius;
        if (mouseX > topX && mouseX < botX && mouseY > leftY && mouseY < rightY) {
            bubbles[i].popped = true;
        }
    }
}

function blowBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    bubbles.push(new makeBubble(mouseX, mouseY));
}

function makeBubble(x, y) {
    this.originalRadius = 25;
    this.radius = this.originalRadius;
    this.x = x;
    this.y = y;
    this.dirX = 0;
    this.dirY = 0;
    this.opa = Math.random() * 0.5 + 0.5;
    this.bubbleColor = "rgba(187, 253, 255, " + this.opa + ")";
    this.largeReflectionColor = "rgba(255, 255, 255, 0.55)";
    this.smallReflectionColor = "rgba(255, 255, 255, 0.25)";
    this.popped = false;
    this.ready = false;
}

function releaseBubble(event) {
    var n = bubbles.length;
    if (bubbles[n-1].popped == false) {
        bubbles[n-1].ready = true;
        bubbles[n-1].dirX = Math.round(Math.random() * 20) -10;
        bubbles[n-1].dirY = Math.round(Math.random() * 20) -10;
        bubbles[n-1].originalRadius = bubbles[n-1].radius;
    }
}

function makeThemMove() {
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    for (var i = 0; i < bubbles.length; i++) {
        if (bubbles[i].ready == false && bubbles[i].radius > 70) {
            bubbles[i].originalRadius = 70;
            bubbles[i].popped = true;
        }
        if (bubbles[i].radius < 1.4 * bubbles[i].originalRadius || bubbles[i].popped == false) {
            if (bubbles[i].popped == true) {
                bubbles[i].radius *= 1.15;
            }
            if (bubbles[i].ready == false) {
                bubbles[i].radius *= 1.02;
            }
            drawBubble(i);
            updateBubble(i);
        }
    }
}

function drawBubble(i) {
    drawCircle(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].bubbleColor);
    drawCircle(bubbles[i].x - (0.4 * bubbles[i].radius), bubbles[i].y - (0.4 * bubbles[i].radius), 0.3 * bubbles[i].radius, bubbles[i].largeReflectionColor);
    drawCircle(bubbles[i].x + (0.5 * bubbles[i].radius), bubbles[i].y + (0.5 * bubbles[i].radius), 0.1 * bubbles[i].radius, bubbles[i].smallReflectionColor);
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.fillStyle = color;
    ctx.closePath();
    ctx.fill();
}

function updateBubble(i) {
    if (bubbles[i].x < bubbles[i].radius || bubbles[i].x > myCanvas.width - bubbles[i].radius) {
        bubbles[i].dirX = -bubbles[i].dirX;
    }
    if (bubbles[i].y < bubbles[i].radius || bubbles[i].y > myCanvas.height - bubbles[i].radius) {
        bubbles[i].dirY = -bubbles[i].dirY;
    }
    if (bubbles[i].x > myCanvas.width) {
        bubbles[i].x = myCanvas.width - 150;
    }
    if (bubbles[i].y > myCanvas.height) {
        bubbles[i].y = myCanvas.height - 150;
    }
    bubbles[i].x += bubbles[i].dirX;
    bubbles[i].y += bubbles[i].dirY;
}