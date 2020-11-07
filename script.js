var innerBox;
var outerBox;

function startGame() {  
    myGameArea.start();
    outerBox = new component(100, 100, "orange", 10, 440)
    innerBox = new component(50, 50, "blue", 35, 465)
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
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
        
    }
    else if (e.keyCode == '39') {
       // right arrow
        outerBox.a = outerBox.a + 10;
        innerBox.a = innerBox.a + 10;
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