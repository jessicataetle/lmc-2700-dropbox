var innerBox;
var outerBox;
var startButton;
var inBox = true;
var canvasHeight = 540;
var canvasWidth = 960;
var jumping = false;
var velX = 0;
var velY = 0;
const state = {
    MENU: 'menu',
    GAME: 'game',
}

var stateMachine = {
    interval: '',
    currState: '',
    stateMachine: function(state, change) {
        if (change) {
            clearInterval(this.interval)
        }
        switch(state) {
            case 'game':
                this.currState = state;
                this.interval = setInterval(updateGame, 20)
                break;
            case 'menu':
                this.currState = state;
                this.interval = setInterval(menu, 20)
                break;
        }
    }
}

function onLoad() {
    myGameArea.setup();
    //myGameArea.menu();
    startButton = new component(200, 100, "pink", (canvasWidth / 2) - 100, (canvasHeight / 2) - 50, "button", "start");
    stateMachine.stateMachine(state.MENU, false)
    if(stateMachine.currState == "menu") {
         myGameArea.canvas.onmousedown = goToStart
    } else {
        console.log('hey')
    }
}

function goToStart() {
    startGame();
    stateMachine.stateMachine(state.GAME, true)
    console.log(stateMachine.currState)
}

function menu() {
    startButton.update();
}

function startGame() {
    myGameArea.clear();
    outerBox = new outerBox(100, 100, "orange", 0, canvasHeight - 100)
    innerBox = new innerBox(50, 50, "blue", 25, canvasHeight - 75)
    outerBox.update();
    innerBox.update();
}

function updateGame() {
    myGameArea.clear();
    document.onkeydown = checkKey.checkKey;
    document.onkeyup = checkKey.checkKey;
    if (jumping) {
        jump()
    }
    outerBox.update();
    innerBox.update();
}

function updateVel(object) {
    if (checkKey.up && jumping == false) {
        velY -= object.velY;
        jumping = true;
    }

    if (checkKey.left) {
        if (object.crashLeft(outerBox)) {
            object.x = outerBox.x + outerBox.width;
        } else {
            velX -= object.velX
            object.x += velX; 
        }
    }

    if (checkKey.right) {
        if (object.crashRight(outerBox)) {
            object.x = outerBox.x - object.width;
       } else {
            velX += object.velX
            object.x += velX; 
        }
    }
    object.y += velY;
    velX *= 0.9;// friction
    velY *= 0.9;// friction
    if (object.x < 0) {
        velX = 0;
        object.x = 0;
    }
    if (object.x + object.width > canvasWidth) {
        velX = 0;
        object.x = canvasWidth - object.width
    }
}



var checkKey = {
    left: false,
    right: false,
    up: false,
    checkKey: function(e) {
        e = e || window.event;
        var key_state = (e.type == "keydown") ? true : false;
        switch(e.keyCode) {
            case 37:// left key
                checkKey.left = key_state;
                break;
            case 38:// up key
                checkKey.up = key_state;
                break;
            case 39:// right key
                checkKey.right = key_state;
                break;
        }
        if (e.keyCode == '88' && e.type == "keydown") {//X 
            if(inBox) {
                if(outerBox.x > 50) {
                    innerBox.x = outerBox.x - 50;
                    innerBox.y = 490;
                    velX = 0;
                    inBox = false;
                }
            } else {
                innerBox.x = outerBox.x + 25;
                innerBox.y = outerBox.y + 25;
                inBox = true;
            }
        }
    }
}

function jump() {
    if (inBox) {
        if((outerBox.y + outerBox.height + velY) <= 540) {
            outerBox.y = velY + outerBox.y;
            innerBox.y = outerBox.y + 25;
            velY++;
        } else {
            jumping = false;
            velY = 0;
            outerBox.y = canvasHeight - 100;
            innerBox.y = outerBox.y + 25;
        }
    } else {
        if(innerBox.crashDown(outerBox)) {
            innerBox.y = canvasHeight - outerBox.height - innerBox.height
            velY = 0;
            jumping = false;
        } else {
            if((innerBox.y + innerBox.height + velY <= 540)) {
                innerBox.y = velY + innerBox.y;
                velY++;
            } else {
                jumping = false;
                velY = 0;
            }
        }
    }
}
  
var myGameArea = {    
   canvas : document.createElement("canvas"),  
    setup : function() {  
        this.canvas.width = canvasWidth;  
        this.canvas.height = canvasHeight;  
        this.context = this.canvas.getContext("2d");  
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    start : function(state) {
        //startGame();
        //clearInterval(this.interval);
        //this.interval = setInterval(stateMachine(state), 20);  
    }, 
    clear : function() {  
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }  
}

function outerBox(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 0.5;
    this.velY = 10;
    this.update = function() {
        if (inBox) {
            updateVel(outerBox);
        }
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
    this.crashDown = function(otherobj) {
        return (this.y + this.height >= otherobj.y) && ((this.x > otherobj.x) || (this.x + this.width < otherobj.x + otherobj.width))
    }
}

function innerBox(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 20;
    this.update = function() {
        if(inBox) {
            this.x = outerBox.x + 25;
            this.y = outerBox.y + 25;
        } else {
            updateVel(innerBox)
        }
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
    this.crashRight = function(otherobj) {
       return ((this.x + this.width) >= otherobj.x) && (this.x < otherobj.x) && this.y > otherobj.y
    }
     this.crashLeft = function(otherobj) {
        return (this.x <= (otherobj.x + otherobj.width)) && (this.x > otherobj.x) && this.y > otherobj.y
    }
    this.crashDown = function(otherobj) {
        return (this.y + this.height >= otherobj.y) && ((this.x + this.width > otherobj.x) && (this.x < otherobj.x + otherobj.width))
    }    
}

function component(width, height, color, x, y, type, text) {   
    this.width = width;  
    this.height = height;      
    this.x = x;  
    this.y = y;
    this.type = type;
    this.update = function() {  
        ctx = myGameArea.context;    
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }  
}  