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
let level1Plan =
".................." +
".................." +
".................." +
".................." +
".................." +
".................." +
".................." +
"......######......" +
"@.....######......" +
"......######......" +
"......######......" +
"##################"
let level2Plan =
".................." +
".................." +
".................." +
".................." +
".................." +
".................." +
"########.........." +
"...............###" +
"@..............###" +
"...............###" +
"...............###" +
"##################"
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

//initializes game
function initLevel1() {
    myGameArea.clear();
    //@matthew instantiate astronaut here
    //@matthew example of instantiating here w/ portal 
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, img, "./portal.png")
    //initLevel1Levels();
    initNewLevel(level1Plan)
    astronaut.draw();
    portal.draw();
}

//function initLevel1Levels() {
//    level.push(new component(1000, 50, "purple", 0, canvasHeight - 50, false))
//    //bump
//    level.push(new component(300, 250, "purple", canvasWidth / 2 - 150, canvasHeight - 250, false))
//    for(var i = 0; i < level.length; i++) {
//        level[i].draw();
//    }
//}
function initNewLevel(levelPlan) {
    level = []
    var col = 0;
    var row = 0;
    for(var i = 0; i < levelPlan.length; i++) {
        if(levelPlan.charAt(i) == '#') {
            level.push(new component(50, 50, "purple", col, row, false))
            //i = j;
        } else if (levelPlan.charAt(i) == '@') {
            astronaut = null;
            astronaut = new Astronaut(100, 150, "blue", col, row)
        }
        
        if(col == canvasWidth - 50) {
            col = 0;
            row += 50;
        } else {
            col += 50;
        }
    }
}

function inBackpackBounds() {
    if (backpack.x + backpack.width < astronaut.x) {
        level.push(backpack)
        dropBox = false;
    } else if (backpack.x > astronaut.x + astronaut.width) {
        level.push(backpack)
        dropBox = false;
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
        if (e.keyCode == '88' && e.type == "keydown" && !jumping) {
            if(onBack) {
                dropBackpack();
            } else {
                pickUpBackpack();
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
    var stop = false;
    for(var i = 0; i < level.length; i++) {
        //console.log(genericCollision(astronaut.y + (velY + 0.5), level[i].y, astronaut.height, level[i].height) && genericCollision(astronaut.x, level[i].x, astronaut.width, level[i].width))
        if(genericCollision(astronaut.y + (velY + 1), level[i].y, astronaut.height, level[i].height) && genericCollision(astronaut.x, level[i].x, astronaut.width, level[i].width)) {
            stop = true;
            velY = 0;
            level[i].isActive = true;
            if(!onBack) {
                astronaut.y = level[i].y - astronaut.height;
                //jumping = false;
            } else {
                astronaut.y = level[i].y - astronaut.height;
            }
            //break;
        } else {
            //console.log(astronaut.y)
        }
    }
    if (stop) {
        jumping = false;
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