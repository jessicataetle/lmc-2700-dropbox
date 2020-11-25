var astronaut;
var portal;  
var backpack;
var onBack = true;
var dropBox = false;
var canvasHeight = 600;
var canvasWidth = 900;
var jumping = false;
var velX = 0;
var velY = 0;
var level = [];
var img = new Image();
const state = {
    MENU: 'menu',
    GAME: 'game',
}

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
    //@matthew start game component should be instantiated here
}

//start loop
function start() {
    //@matthew start game animation
}

//start -> game
function goToGame() {
    stateMachine.stateMachine(state.GAME, true)
    initLevel1();
}

//initializes game
function initLevel1() {
    myGameArea.clear();
    //@matthew instantiate astronaut here
    astronaut = new astronaut(100, 150, "blue", 0, canvasHeight - 200) //50, 100
    //@matthew example of instantiating here w/ portal 
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, img, "./portal.png")
    initLevel1Levels();
    astronaut.draw();
    portal.draw()
}

function initLevel1Levels() {
    level.push(new component(1000, 50, "purple", 0, canvasHeight - 50, false))
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
    updateVelAstronaut();
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
    //@matthew I think the best way to do this is make animation functions that change the source of the image and call them here - also astronaut animation can be based on velocity (ex: negative velX means astronaut is going left). Also you can change the src of an image by doing: {variable name}.src = {new source}
    drawLevels();
    astronaut.draw();
    portal.draw();
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
                dropBackpack();
            } else {
                pickUpBackpack();
                console.log(level);
            }
        }
    }
}

function dropBackpack() {
    velX = 0;
    onBack = false
    backpack = new component(50, 100, "orange", astronaut.x, canvasHeight - 150, false)
    dropBox = true
    astronaut.width = 50;
    astronaut.height = 100;
    astronaut.y = canvasHeight - 150
}

function pickUpBackpack() {
    if(backpack.y == astronaut.y &&
        ((astronaut.x - (backpack.x + backpack.width) < 5 && astronaut.x - (backpack.x + backpack.width) > 0) ||
        (backpack.x - (astronaut.x + astronaut.width) < 5 && backpack.x - (astronaut.x + astronaut.width) > 0))) {
            onBack = true;
            astronaut.width = 100;
            astronaut.height = 150;
            astronaut.y = canvasHeight - 200;
            if(!dropBox) {
                level.pop();
                findSpot();
            }
    } 
}

function findSpot() {
    console.log(astronaut.x)
    console.log("collistionLeft: " + checkCollisionLeft())
    console.log("collisionRight: " + checkCollisionRight())
    if(!checkCollisionLeft() && !checkCollisionRight()) {
        return;
    } else {
        while(checkCollisionRight()) {
            astronaut.x = astronaut.x - 1;
        }
        while(checkCollisionLeft()) {
            astronaut.x = astronaut.x + 1;
        }
    }
}

//jump / gravity function
function jump() {
    for(var i = 0; i < level.length; i++) {
        if(genericCollision(astronaut.y + (velY + 0.5), level[i].y, astronaut.height, level[i].height) && genericCollision(astronaut.x, level[i].x, astronaut.width, level[i].width)) {
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

//update velocity function
function updateVelAstronaut() {
    if (checkKey.up && !jumping) {
        velY -= astronaut.velY; //change so same velocity
        jumping = true;
    }
    
    if (checkKey.left) {
        var collisionLeft = checkCollisionLeft();
        if (!collisionLeft) {
            velX -= astronaut.velX
            astronaut.x += velX;
            checkFallLeft();
        }
    }

    if (checkKey.right) {
        var collisionRight = checkCollisionRight();
        if (!collisionRight) {
            velX += astronaut.velX
            astronaut.x += velX;
            checkFallRight();
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

function checkFallRight() {
    for (var i = 0; i < level.length; i++) {
        if(level[i].isActive) {
            if (astronaut.x > level[i].x + level[i].width) {
                jumping = true;
                level[i].isActive = false;
            }
        }
    }
}

function checkFallLeft() {
    for (var i = 0; i < level.length; i++) {
        if(level[i].isActive) {
            if (astronaut.x + astronaut.width < level[i].x) {
                jumping = true;
                level[i].isActive = false;
            }
        }
    }
}

function drawLevels() {
    for(var i = 0; i < level.length; i++) {
        level[i].draw();
    }
}

function checkCollisionLeft() {
     for(var i = 0; i < level.length; i++) {
        if(genericCollision(astronaut.x + (velX - astronaut.velX), level[i].x, astronaut.width, level[i].width) && genericCollision(astronaut.y + velY - 1, level[i].y, astronaut.height, level[i].height)) {
            return true;
        }
    }
    return false;
}

function checkCollisionRight() {
    for(var i = 0; i < level.length; i++) {
        if(genericCollision((velX + astronaut.velX) + astronaut.x, level[i].x, astronaut.width, level[i].width) && genericCollision(astronaut.y + velY - 1, level[i].y, astronaut.height, level[i].height)) {
            return true;
        } 
    }
    return false;
}

function collision(objX, objY, objWidth, objHeight, otherObjX, otherObjY, otherObjWidth, otherObjHeight) { 
        var myleft = objX;
        var myright = objX + objWidth;
        var mytop = objY;
        var mybottom = objY + objHeight;
        var otherleft = otherObjX;
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

function astronaut(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 12;
    this.draw = function() {
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}

//@matthew astronaut image function
function astronautI(width, height, x, y, img, src) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 12;
    this.img = img;
    this.img.src = src;
    this.src = src;
    this.draw = function() {
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

//@matthew everything else image function
function componentI(width, height, x, y, img, src) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.img = img;
    this.src = src;
    this.img.src = this.src;
    this.draw = function() {
        ctx = myGameArea.context;   
        ctx.drawImage(img, this.x, this.y, this.width, this.height);  
    }
}

