function startGame() {  
    myGameArea.start();
    var outerBox = new component(100, 100, "orange", 10, 440)
    var innerBox = new component(50, 50, "blue", 35, 465)
}
  
var myGameArea = {    
   canvas : document.createElement("canvas"),  
    start : function() {  
        this.canvas.width = 960;  
        this.canvas.height = 540;  
        this.context = this.canvas.getContext("2d");  
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
    ctx = myGameArea.context;  
    ctx.fillStyle = color;  
    ctx.fillRect(this.a, this.b, this.width, this.height);  
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