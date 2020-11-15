var astronaut;
var backpack;
var startButton;
var onBack = true;
var dropBox = false;
var canvasHeight = 540;
var canvasWidth = 960;
var jumping = false;
var velX = 0;
var velY = 0;
const state = {
    MENU: 'menu',
    GAME: 'game',
}
var prevDirection = 'right'


//state machins
var stateMachine = {
    interval: '',
    stateMachine: function(state, change) {
        if (change) {
            clearInterval(this.interval)
        }
        switch(state) {
            case 'game':
                this.interval = setInterval(game, 20)
                break;
            case 'menu':
                this.interval = setInterval(start, 20)
                break;
        }
    }
}

//start screen
function onLoad() {
    myGameArea.setup();
    startButton = new component(200, 100, "pink", (canvasWidth / 2) - 100, (canvasHeight / 2) - 50, "button", "start");
    stateMachine.stateMachine(state.MENU, false)
    myGameArea.canvas.addEventListener('click',  goToGame , { once: true })
}

//start loop
function start() {
    startButton.update();
}

//start -> game
function goToGame() {
    stateMachine.stateMachine(state.GAME, true)
    initGame();
}

//initializes game
function initGame() {
    myGameArea.clear();
    backpack = new backpack(50, 100, "orange", 0, canvasHeight - 150, false)
    astronaut = new astronaut(50, 100, "blue", 50, canvasHeight - 100)
    astronaut.updateAndDraw();
    backpack.updateAndDraw();
}

//game loop
function game() {
    myGameArea.clear();
    document.onkeydown = checkKey.checkKey;
    document.onkeyup = checkKey.checkKey;
    if (jumping) {
        jump()
    }
    backpack.updateAndDraw();
    astronaut.updateAndDraw();
}

//update velocity function
function updateVelAstronaut(object) {
    if (checkKey.up && !jumping) {
        velY -= object.velY; //change so same velocity
        jumping = true;
    }
    if (checkKey.left) {
        if (object.crashLeft(backpack)) {
            object.x = backpack.x + backpack.width;
        } else if (backpack.isActive && object.x + object.width < backpack.x) {
            jumping = true;
            backpack.isActive = false;
        } else {
            velX -= object.velX
            object.x += velX; 
        }
    }

    if (checkKey.right) {
        if (object.crashRight(backpack)) {
            object.x = backpack.x - object.width;
        } else if (backpack.isActive && object.x > backpack.x + backpack.width) {
                jumping = true;
                backpack.isActive = false;
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

function updateVelBackPack() {
    if (checkKey.up && !jumping) {
        velY -= astronaut.velY; //change so same velocity
        jumping = true;
    }
    if (checkKey.left) {
        backpack.x = astronaut.x + astronaut.width + velX;
        if (astronaut.x == canvasWidth - backpack.width) {
            backpack.x = canvasWidth - backpack.width
            astronaut.x = canvasWidth - (astronaut.width * 2)
        }
    }

    if (checkKey.right) {
        backpack.x = astronaut.x - backpack.width + velX;
        changeDirections('right');
        if (astronaut.x == 0) {
            backpack.x = 0;
            astronaut.x = backpack.width
        }
    }
    backpack.y += velY;
    //velX *= 0.9;// friction
    //velY *= 0.9;// friction
    if (backpack.x < 0) {
        velX = 0;
        backpack.x = 0;
    }
    if (backpack.x + backpack.width > canvasWidth) {
        velX = 0;
        backpack.x = canvasWidth - backpack.width
    }
}


//check key inputs
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
        if (e.keyCode == '88' && e.type == "keydown" && !jumping) {//X 
            if(onBack) {
                velX = 0;
                onBack = false;
                dropBox = true;
                jumping = true;
            } else {
                astronaut.x = backpack.x + 25;
                astronaut.y = backpack.y + 25;
                onBack = true;
                backpack.isActive = false;
            }
        }
    }
}

//check to see if backpack needs to change locations
function changeDirections(newDirection) {
    if(newDirection != prevDirection) {
        if(astronaut.x <= 0) {
            
        }
        backpack.x = astronaut.x + astronaut.width
        prevDirection = newDirection
    }
}

//jump / gravity function
function jump() {
    if (inBox) {
        if((outerBox.y + outerBox.height + velY) <= 490) {
            outerBox.y = velY + outerBox.y;
            innerBox.y = outerBox.y + 50;
            velY++;
        } else {
            jumping = false;
            velY = 0;
            outerBox.y = canvasHeight - 150;
            innerBox.y = outerBox.y + 50;
        }
    } else {
        if(dropBox) {
            if ((backpack.y + backpack.height + velY) <= 540) {
                backpack.y = velY + backpack.y;
                velY++;
            } else {
                jumping = false;
                dropBox = false;
                velY = 0;
                backpack.y = canvasHeight - backpack.height;
            }
        } else {
            if(astronaut.crashDown(backpack)) {
                astronaut.y = canvasHeight - backpack.height - astronaut.height
                backpack.isActive = true;
                velY = 0;
                jumping = false;
            } else {
                if((astronaut.y + astronaut.height + velY <= 540)) {
                    astronaut.y = velY + astronaut.y;
                    velY++;
                } else {
                    jumping = false;
                    velY = 0;
                    astronaut.y = canvasHeight - astronaut.height
                }
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
    clear : function() {  
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }  
}

function backpack(width, height, color, x, y, isActive) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.isActive = isActive;
    this.updateAndDraw = function() {
        if (onBack) {
            updateVelBackPack()
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

function astronaut(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 15;
    this.updateAndDraw = function() {
        updateVelAstronaut(astronaut);
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