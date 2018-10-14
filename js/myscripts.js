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
    document.getElementById("color-bubbles").onclick = function() {
        currentTool = 1;
    }      
    document.getElementById("freeze-bubbles").onclick = function() {
        currentTool = 2;
    }
    document.getElementById("pop-bubbles").onclick = function() {
        currentTool = 3;
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
            colorBubble(event);
            break;
        case 2:
            freezeBubble(event);
            break;
        case 3:
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

function blowBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    bubbles.push(new makeBubble(mouseX, mouseY));
}

function colorBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    for (var i = 0; i < bubbles.length; i++) {
        var topX = bubbles[i].x - bubbles[i].radius;
        var botX = bubbles[i].x + bubbles[i].radius;
        var leftY = bubbles[i].y - bubbles[i].radius;
        var rightY = bubbles[i].y + bubbles[i].radius;
        if (mouseX > topX && mouseX < botX && mouseY > leftY && mouseY < rightY) {
            bubbles[i].randomColor = randomColor(0.4);
            bubbles[i].painted++;
        }
    }
}

function freezeBubble(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    for (var i = 0; i < bubbles.length; i++) {
        var topX = bubbles[i].x - bubbles[i].radius;
        var botX = bubbles[i].x + bubbles[i].radius;
        var leftY = bubbles[i].y - bubbles[i].radius;
        var rightY = bubbles[i].y + bubbles[i].radius;
        if (mouseX > topX && mouseX < botX && mouseY > leftY && mouseY < rightY) {
            if (bubbles[i].frozen == false) {
                bubbles[i].frozen = true;
                bubbles[i].dirX = 0;
                bubbles[i].dirY = 0;
                break;
            }
            else if (bubbles[i].frozen == true) {
                bubbles[i].frozen = false;
                bubbles[i].dirX = Math.round(Math.random() * 20) -10;
                bubbles[i].dirY = Math.round(Math.random() * 20) -10;
                break;
            }
        }
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

function makeBubble(x, y) {
    this.originalRadius = 25;
    this.radius = this.originalRadius;
    this.x = x;
    this.y = y;
    this.dirX = 0;
    this.dirY = 0;
    this.opa = Math.random() * 0.3 + 0.3;
    this.bubbleColor = "rgba(165, 253, 255, " + this.opa + ")";
    this.largeReflectionColor = "rgba(255, 255, 255, 0.45)";
    this.smallReflectionColor = "rgba(255, 255, 255, 0.20)";
    this.randomShade = randomColor(0.08);
    this.randomColor = randomColor(0.4);
    this.ready = false;
    this.painted = 0;
    this.frozen = false;
    this.popped = false;
}

function randomColor(opacity) {
    var red = Math.round(Math.random() * 255);
    var green = Math.round(Math.random() * 255);
    var blue = Math.round(Math.random() * 150);
    var color = "rgba(" + red + ", " + green + ", " + blue + "," + opacity + ")";
    return color;
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
        if (bubbles[i].ready == false && bubbles[i].radius > 75) {
            bubbles[i].originalRadius = 75;
            bubbles[i].popped = true;
        }
        if (bubbles[i].radius < 1.4 * bubbles[i].originalRadius || bubbles[i].popped == false) {
            if (bubbles[i].popped == true) {
                bubbles[i].radius *= 1.15;
            }
            if (bubbles[i].ready == false) {
                bubbles[i].radius *= 1.02;
            }
            if (bubbles[i].painted == 0) {
                drawBubble(i);
            }
            if (bubbles[i].painted > 0) {
                drawColoredBubble(i);
            }
            updateBubble(i);
        }
    }
}

function drawBubble(i) {
    drawRadialGradient(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].bubbleColor);
    drawCircle(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].bubbleColor);
    drawCircle(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].randomShade);
    drawCircle(bubbles[i].x - (0.4 * bubbles[i].radius), bubbles[i].y - (0.4 * bubbles[i].radius), 0.3 * bubbles[i].radius, bubbles[i].largeReflectionColor);
    drawCircle(bubbles[i].x + (0.5 * bubbles[i].radius), bubbles[i].y + (0.5 * bubbles[i].radius), 0.1 * bubbles[i].radius, bubbles[i].smallReflectionColor);
}

function drawColoredBubble(i) {
    drawRadialGradient(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].bubbleColor);
    drawCircle(bubbles[i].x, bubbles[i].y, bubbles[i].radius, bubbles[i].randomColor);
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

function drawRadialGradient(x, y, radius, color) {
    ctx.beginPath();
    var grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0, "rgba(255, 255, 255, 0)");
    grd.addColorStop(1, color);
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.fillStyle = grd;
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

