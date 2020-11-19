var astronaut;
var portal; 
var startButton;
var backpack;
var onBack = true;
var dropBox = false;
var canvasHeight = 600;
var canvasWidth = 900;
var jumping = false;
var velX = 0;
var velY = 0;
var level = [];
var newLevel;
var activeLevel;
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
    stateMachine.stateMachine(state.MENU, false)
    myGameArea.canvas.addEventListener('click',  goToGame , { once: true })
}

//start loop
function start() {

}

//start -> game
function goToGame() {
    stateMachine.stateMachine(state.GAME, true)
    initGame();
}

//initializes game
function initGame() {
    myGameArea.clear();
    astronaut = new astronaut(100, 150, "blue", 0, canvasHeight - 200) //50, 100 
    portal = new component(75, 125, "green", canvasWidth - 75, canvasHeight - 175)
    initLevels();
    astronaut.updateAndDraw();
    portal.draw()
}

function initLevels() {
    var x = 0;
    var i = 0;
    //floor
    //while (x < canvasWidth) {
        level.push(new component(1000, 50, "purple", 0, canvasHeight - 50, false))
        //x += 100;
    //}
    //bump
    level.push(new component(300, 250, "purple", canvasWidth / 2 - 150, canvasHeight - 250, false))
    for(var i = 0; i < level.length; i++) {
        level[i].draw();
    }
}

//game loop
function game() {
    myGameArea.clear();
    document.onkeydown = checkKey.checkKey;
    document.onkeyup = checkKey.checkKey;
    if (jumping) {
        jump()
    }
    updateVelAstronaut()
    updateAndDrawLevels();
    if (dropBox) {
        backpack.draw()
        if (backpack.x + backpack.width < astronaut.x) {
            level.push(backpack)
            dropBox = false;
        } else if (backpack.x > astronaut.x + astronaut.width) {
            level.push(backpack)
            dropBox = false;
        }
    }
    astronaut.updateAndDraw()
    //backpack.updateAndDraw();
    //astronaut.updateAndDraw();
    portal.draw()
}

function updateAndDrawLevels() {
    for(var i = 0; i < level.length; i++) {
//        if(astronaut.x >= level[i].x && astronaut.x + astronaut.width <= level[i].x + level[i].width) {
//            level[i].isActive = true;
//        } else {
//            level[i].isActive = false;
//        }
        level[i].draw();
    }
}

//update velocity function
function updateVelAstronaut() {
    if (checkKey.up && !jumping) {
        velY -= astronaut.velY; //change so same velocity
        jumping = true;
    }
    if (checkKey.left) {
        var collisionLeft = false;
        for(var i = 0; i < level.length; i++) {
            if(genericCollision(astronaut.x + (velX - astronaut.velX), level[i].x, astronaut.width, level[i].width)) {
                collisionLeft = genericCollision(astronaut.y + velY - 1, level[i].y, astronaut.height, level[i].height);
                console.log(collisionLeft)
            }
        }
        if (!collisionLeft) {
            velX -= astronaut.velX
            astronaut.x += velX;
             for (var i = 0; i < level.length; i++) {
                if(level[i].isActive) {
                    if (astronaut.x + astronaut.width < level[i].x) {
                        jumping = true;
                        level[i].isActive = false;
                    }
                }
            }
        }
    }

    if (checkKey.right) {
            var collisionRight = false;
            for(var i = 0; i < level.length; i++) {
                if(genericCollision(astronaut.x + velX + astronaut.velX, level[i].x, astronaut.width, level[i].width)) {
                    collisionRight = genericCollision(astronaut.y + velY - 1, level[i].y, astronaut.height, level[i].height);
                } 
            }
        if (!collisionRight) {
            velX += astronaut.velX
            astronaut.x += velX;
            for (var i = 0; i < level.length; i++) {
                if(level[i].isActive) {
                    if (astronaut.x > level[i].x + level[i].width) {
                        jumping = true;
                        level[i].isActive = false;
                    }
                }
            }
        }
    }
    //astronaut.y += velY;
    velX *= 0.9;// friction
    // friction
    if (astronaut.x < 0) {
        velX = 0;
        astronaut.x = 0;
    }
    if (astronaut.x + astronaut.width > canvasWidth) {
        velX = 0;
        astronaut.x = canvasWidth - astronaut.width
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
                // backpack.y = canvasHeight - backpack.height
                onBack = false
                backpack = new component(50, 100, "orange", astronaut.x, canvasHeight - 150, false)
                dropBox = true
                astronaut.width = 50;
                astronaut.height = 100;
                astronaut.y = canvasHeight - 150
                //change size of astronaut
//                onBack = false;
//                dropBox = true;
//                jumping = true;
            } else {
                onBack = true;
                astronaut.width = 100;
                astronaut.height = 150;
                astronaut.y = canvasHeight - 200
                level.pop()
                
                // backpack.isActive = false;
            }
        }
    }
}

//jump / gravity function
function jump() {
    for(var i = 0; i < level.length; i++) {
        if(genericCollision(astronaut.y + velY + 0.5, level[i].y, astronaut.height, level[i].height) && genericCollision(astronaut.x, level[i].x, astronaut.width, level[i].width)) {
            jumping = false;
            velY = 0;
            level[i].isActive = true;
            if(!onBack) {
                astronaut.y = level[i].y - astronaut.height - 0.5;
            } else {
                astronaut.y = level[i].y - astronaut.height;
            }
        } else {
            astronaut.y += velY;
            velY += 0.5;
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

function collision(objX, objY, objWidth, objHeight, otherObjX, otherObjY, otherObjWidth, otherObjHeight) { 
        var myleft = objX;  //0
        var myright = objX + objWidth; // 50
        console.log(myright)
        var mytop = objY;  //390
        var mybottom = objY + objHeight; //490
        var otherleft = otherObjX;
        console.log(otherleft)
        var otherright = otherObjX + otherObjWidth;
        var othertop = otherObjY;
        var otherbottom = otherObjY + otherObjHeight;
        if(myright > otherleft || myleft < otherright || mytop > otherbottom || mybottom < othertop) {
            return true;
        } else {
            return false;
        }
}

function genericCollision(posA, posB, lenA, lenB)   {
    if ((posA + lenA) > posB && posA < (posB + lenB)) {
        return true
    } else {
        return false
    }
}

function collisionY(posA, posB, lenA, lenB)   {
    console.log(posA, posB, lenA, lenB)
    if ((posA + lenA) > posB && posA < (posB + lenB)) {
        return true
    } else {
        return false
    }
}

function astronaut(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 12;
    this.updateAndDraw = function() {
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}

function component(width, height, color, x, y, isActive) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.isActive = isActive;
    this.draw = function() {
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}
