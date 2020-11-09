var innerBox;
var outerBox;
var inBox = true;

function startGame() {  
    myGameArea.start();
    outerBox = new component(100, 100, "orange", 0, 440)
    innerBox = new component(50, 50, "blue", 25, 465)
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
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
        if (inBox) {
            if (outerBox.a > 0) {
                outerBox.a = outerBox.a - 15;
                innerBox.a = innerBox.a - 15;
            }
        } else {
            if (innerBox.a > 0) {
                innerBox.a = innerBox.a - 15;
            }
        }
    }
    else if (e.keyCode == '39') {
       // right arrow
        if (inBox) {
            if (outerBox.a < (960 - outerBox.width)) {
                outerBox.a = outerBox.a + 15;
                innerBox.a = innerBox.a + 15;
            }
        } else {
            if (innerBox.a < (960 - innerBox.width)) {
                innerBox.a = innerBox.a + 15;
            }
        }
    } else if(e.keyCode == '88') {
        //X
        if(inBox) {
            if(outerBox.a > 65) {
                innerBox.a = outerBox.a - 50;
                innerBox.b  = 490;
                inBox = false;
            }
        }
    }

}

function jump() {
    counter = 0;
    while(counter < 20) {
        outerBox.b -= 1;
        innerBox.b -= 1;
        counter++;
    }
}

function drawGame() {
    
}
  
var myGameArea = {    
   canvas : document.createElement("canvas"),  
    start : function() {  
        this.canvas.width = 960;  
        this.canvas.height = 540;  
        this.context = this.canvas.getContext("2d");  
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);  
    },
    clear : function() {  
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }  
}

function component(width, height, color, a, b) {  
    this.width = width;  
    this.height = height;  
    this.a = a;  
    this.b = b;      
    this.update = function() {  
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.a, this.b, this.width, this.height);  
    }
    this.clear = function() {
        ctx = myGameArea.context;
        ctx.clearRect(this.a, this.b, this.width, this.height);  
    }  
}

function drawOuterBox(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;      
    ctx = myGameArea.context;  
    ctx.fillStyle = color;
    ctx.lineWidth = 40;
    ctx.strokeRect(this.x, this.y, this.width, this.height);  
}  