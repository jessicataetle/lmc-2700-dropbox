var astronaut;
var portal;  
var backpack;
var collisionRight;
var collisionLeft;
var onBack = true;
var dropBox = false;
var canvasHeight = 600;
var canvasWidth = 900;
var jumping = false;
var velX = 0;
var velY = 0;
var level = [];
var powerups = [];
var bushes = [];
var activePowerup = false;
var activePowerupBlock;
var img = new Image();
var imgB = new Image();
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
"####.............." +
"####.............." +
"####............*." +
"####.............." +
"#######..........." +
"@..............###" +
"...............###" +
"...............###" +
"##################"
let level3Plan =
".......................*......" +
".............................." +
".............................." +
"...............###########...." +
"...........###############...." +
"...........###############...." +
"...........###############...." +
"...........###############...." +
"...........###############...." +
".......###################...." +
".......###################...." +
"....*..###################...." +
".......###################...." +
".......###################...." +
"...#######################...." +
"...#######################...." +
"@..#######################...." +
"...~~~~~~~~~~~~~~~~~~~~~~~...." +
"...~~~~~~~~~~~~~~~~~~~~~~~...." +
"##############################"
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

function initNewLevel(levelPlan) {
    level = []
    var col = 0;
    var row = 0;
    for(var i = 0; i < levelPlan.length; i++) {
        if(levelPlan.charAt(i) == '#') {
            level.push(new component(50, 50, "purple", col, row, false))
        } else if (levelPlan.charAt(i) == '@') {
            astronaut = null;
            astronaut = new Astronaut(100, 150, "blue", col, row)
        } else if (levelPlan.charAt(i) == '*') {
            powerups.push(new component(100, 100, "green", col, row))
        }
        
        if(col == canvasWidth - 50) {
            col = 0;
            row += 50;
        } else {
            col += 50;
        }
    }
}
function initNewLevel3(levelPlan) {
    level = []
    var col = 0;
    var row = 0;
    for(var i = 0; i < levelPlan.length; i++) {
        if(levelPlan.charAt(i) == '#') {
            level.push(new component(30, 30, "purple", col, row, false))
        } else if (levelPlan.charAt(i) == '@') {
            astronaut = null;
            astronaut = new Astronaut(60, 90, "blue", col, row)
        } else if (levelPlan.charAt(i) == '*') {
            powerups.push(new component(60, 60, "green", col, row))
        } else if (levelPlan.charAt(i) == '~') {
            bushes.push(new componentI(30, 30, col, row, imgB, "./tall_grass1.png"))
        }
        if(col == canvasWidth - 30) {
            col = 0;
            row += 30;
        } else {
            col += 30;
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
        if (e.keyCode == '90' && e.type == "keydown" && !jumping && !onBack) {
            if (activePowerup) {
                moveBackpackToAstronaut();
                activePowerup = false;
            }
        }
    }
}

function dropBackpack() {
    velX = 0;
    onBack = false
    if (!level3) {
        astronaut.width = 50;
        astronaut.height = 100;
        astronaut.y = astronaut.y + 50
    } else {
        astronaut.width = 30
        astronaut.height = 60
        astronaut.y = astronaut.y + 30
    }
    backpack = new component(astronaut.width, astronaut.height, "orange", astronaut.x, astronaut.y, false)
    dropBox = true
}

function pickUpBackpack() {
    if(backpack.y == astronaut.y &&
        ((astronaut.x - (backpack.x + backpack.width) < 5 && astronaut.x - (backpack.x + backpack.width) > -1) ||
        (backpack.x - (astronaut.x + astronaut.width) < 5 && backpack.x - (astronaut.x + astronaut.width) > -1))) {
            onBack = true;
            if (!level3) {
                astronaut.width = 100;
                astronaut.height = 150;
                astronaut.y = astronaut.y - 50; 
            } else {
                astronaut.width = 60;
                astronaut.height = 90;
                astronaut.y = astronaut.y - 30; 
            }
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

function moveBackpackToAstronaut() {
    level.pop()
    backpack = new component(astronaut.width, astronaut.height, "orange", astronaut.x, astronaut.y, false)
    dropBox = true
}

//update velocity function
function updateVelAstronaut() {
    if (checkKey.up && !jumping) {
        velY -= astronaut.velY; //change so same velocity
        jumping = true;
    }
    
    if (checkKey.left) {
        if (!collisionLeft) {
            velX -= astronaut.velX
            astronaut.x += velX;
            checkFallLeft();
        }
        collisionLeft = checkCollisionLeft();
    }

    if (checkKey.right) {
        if (!collisionRight) {
            velX += astronaut.velX
            astronaut.x += velX;
            checkFallRight();
        }
        collisionRight = checkCollisionRight();
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
//        if(genericCollision(astronaut.x + (velX - astronaut.velX), level[i].x, astronaut.width, level[i].width) && genericCollision(astronaut.y, level[i].y, astronaut.height, level[i].height)) {
         if (collision(astronaut.x + (velX - astronaut.velX), astronaut.y, astronaut.width, astronaut.height, level[i].x, level[i].y, level[i].width, level[i].height)) {
            return true;
        }
    }
    return false;
}

function checkCollisionRight() {
    for(var i = 0; i < level.length; i++) {
//        if(genericCollision((velX + astronaut.velX) + astronaut.x, level[i].x, astronaut.width, level[i].width) && genericCollision(astronaut.y, level[i].y, astronaut.height, level[i].height)) {
        if(collision(astronaut.x + (velX + astronaut.velX), astronaut.y, astronaut.width, astronaut.height, level[i].x, level[i].y, level[i].width, level[i].height)) {
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

function powerUpCollision() {
    for (var i = 0; i < powerups.length; i++) {
         if (collision(astronaut.x, astronaut.y, astronaut.width, astronaut.height, powerups[i].x, powerups[i].y, powerups[i].width, powerups[i].height)) {
             powerups.splice(i,1)
             activePowerup = true;
             activePowerupBlock = new component(50, 50, "green", canvasWidth - 50, 0)
         }
    }
}

function drawLevels() {
    for(var i = 0; i < level.length; i++) {
        level[i].draw();
    }
}

function drawPowerUps() {
    for(var i = 0; i < powerups.length; i++) {
        powerups[i].draw()
    }
}

function drawBushes() {
    for(var i = 0; i < bushes.length; i++) {
        bushes[i].draw()
    }
}