var innerBox;
var outerBox;
var inBox = true;
var outerBoxMass = 20;
var innterBoxMass = 10;
var speed = 3;
var gravity = 1;
var canvasHeight = 540;
var canvasWidth = 960;

function startGame() {  
    myGameArea.start();
    outerBox = new component(100, 100, "orange", 0, canvasHeight - 100)
    innerBox = new component(50, 50, "blue", 25, canvasHeight - 75)
    outerBox.update();
    innerBox.update();
}

function updateGame() {
    myGameArea.clear();
    document.onkeydown = checkKey;
    outerBox.update();
    innerBox.update();
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        //jump()
        if(!inBox) {
            innerBox.x = innerBox.x + 200;
        }
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
        if (inBox) {
            if (outerBox.x > 0) {
                outerBox.x = outerBox.x - 10;
                innerBox.x = innerBox.x - 10;
            }
        } else {
            if (innerBox.x > 0 && !innerBox.crashLeft(outerBox)) {
                innerBox.x = innerBox.x - 10;
            }
        }
    }
    else if (e.keyCode == '39') {
       // right arrow
        if (inBox) {
            if (outerBox.x < (960 - outerBox.width)) {
                outerBox.x = outerBox.x + 10;
                innerBox.x = innerBox.x + 10;
            }
        } else {
            if (innerBox.x < (960 - innerBox.width) && !innerBox.crashRight(outerBox)) {
                innerBox.x = innerBox.x + 10;
            }
        }
    } else if(e.keyCode == '88') {
        //X 
        if(inBox) {
            if(outerBox.x > 50) {
                innerBox.x = outerBox.x - 50;
                innerBox.y = 490;
                inBox = false;
            }
        } else {
            innerBox.x = outerBox.x + 25;
            innerBox.y = outerBox.y + 25;
            inBox = true;
        }
    }

}

function jump() {
}
  
var myGameArea = {    
   canvas : document.createElement("canvas"),  
    start : function() {  
        this.canvas.width = canvasWidth;  
        this.canvas.height = canvasHeight;  
        this.context = this.canvas.getContext("2d");  
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);  
    },
    clear : function() {  
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }  
}

function component(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.update = function() {  
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
    this.crashRight = function(otherobj) {
       return ((this.x + this.width) >= otherobj.x) && (this.x < otherobj.x)
    }
     this.crashLeft = function(otherobj) {
        return (this.x <= (otherobj.x + otherobj.width)) && (this.x > otherobj.x)
    }
}