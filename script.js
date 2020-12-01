var spriteTime = 3;
var spriteNum = 0;
var spriteDirection = "right";
var packText = "-pack";
var leftWalkSprites = [];
var rightWalkSprites = [];
var leftWalkPackSprites = [];
var rightWalkPackSprites = [];
for (var i = 0; i < 7; i++) {
    leftWalkSprites[i] = new Image();
    leftWalkSprites[i].src = "images/astronaut/walk-left/" + (i + 1) + ".png";
}
for (var i = 0; i < 7; i++) {
    rightWalkSprites[i] = new Image();
    rightWalkSprites[i].src = "images/astronaut/walk-right/" + (i + 1) + ".png";
}
for (var i = 0; i < 7; i++) {
    leftWalkPackSprites[i] = new Image();
    leftWalkPackSprites[i].src = "images/astronaut/walk-left-pack/" + (i + 1) + ".png";
}
for (var i = 0; i < 7; i++) {
    rightWalkPackSprites[i] = new Image();
    rightWalkPackSprites[i].src = "images/astronaut/walk-right-pack/" + (i + 1) + ".png";
}
loopingSpriteArray = rightWalkPackSprites;

//import initLevel1 from './game.js'
const state = {
    MENU: 'menu',
    GAME: 'game',
}
var level1 = true;
var level2 = false;
var level3 = false;

//state machine
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
    myGameArea.canvas.addEventListener('click',  goToLevel1, { once: true })
    //@matthew start game component should be instantiated here
}

//start loop
function start() {
    //@matthew start game animation
}

//start -> game
function goToLevel1() {
    stateMachine.stateMachine(state.GAME, true)
    initLevel1();
}

//game loop
function game() {
    document.onkeydown = checkKey.checkKey;
    document.onkeyup = checkKey.checkKey;
    if (jumping) {
        jump()
    }
    updateVelAstronaut();
    powerUpCollision();
    if (dropBox) {
        inBackpackBounds();
    }
    //@matthew I think the best way to do this is make animation functions that change the source of the image and call them here - also astronaut animation can be based on velocity (ex: negative velX means astronaut is going left). Also you can change the src of an image by doing: {variable name}.src = {new source}
    updateAstronautImage();
    myGameArea.clear();
    drawLevels();
    drawPowerUps();
    if(dropBox) {
        backpack.draw();
    }
    astronaut.draw();
    portal.draw();
    if (activePowerup) {
        activePowerupBlock.draw()
    }
    if (level3) {
        drawBushes();
    }
    if(collision(astronaut.x, astronaut.y, astronaut.width, astronaut.height, portal.x, portal.y, portal.width, portal.height)) {
        if(level1) {
            initLevel2();
        }else if (level2) {
            initLevel3();
        }
    }
}

//initializes game
function initLevel1() {
    onBack = true;
    dropBox = false;
    jumping = false;
    myGameArea.clear();
    //@matthew instantiate astronaut here
    //@matthew example of instantiating here w/ portal 
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, img, "./portal.png")
    initNewLevel(level1Plan)
    updateAstronautImage();
    astronaut.draw();
    portal.draw();
}

function initLevel2() {
    onBack = true;
    dropBox = false;
    jumping = false;
    level1 = false;
    level2 = true;
    activePowerup = false;
    myGameArea.clear();
    initNewLevel(level2Plan);
    drawLevels();
    portal = new componentI(75, 125, 0, 25, img, "./portal.png")
    portal.draw();
    astronaut.draw();
}

function initLevel3() {
    onBack = true;
    dropBox = false;
    jumping = false;
    level2 = false;
    level3 = true;
    activePowerup = false;
    myGameArea.clear();
    initNewLevel3(level3Plan);
    drawLevels();
    portal = new componentI(45, 75, canvasWidth - 45, canvasHeight - 105, img, "./portal.png")
    portal.draw();
    astronaut.draw();
}

function updateAstronautImage() {    
    if (onBack) {
        packText = "-pack";
    } else {
        packText = "";
    }
    if (!checkKey.left && !checkKey.right && ! checkKey.up) {
        spriteNum = 1;
    } else if (checkKey.left || checkKey.right) {// execute walking left thing
        if (checkKey.left) {
            spriteDirection = "left";
        } else {
            spriteDirection = "right";
        }
        if (spriteTime >= 0) {
            spriteTime--;
        } else {
            spriteNum++;
            spriteTime = 3;
            if (spriteNum > 7) {
                spriteNum = 1;
            }
        }
    }
    astronaut.img.src = "images/astronaut/walk-" + spriteDirection + packText + "/" + spriteNum + ".png";
}

/*
function updateAstronautImage() {    
    if (!checkKey.left && !checkKey.right && ! checkKey.up) {
        spriteNum = 0;
    } else {
        if (checkKey.left) {
            if (onBack) {
                loopingSpriteArray = leftWalkPackSprites;
            } else {
                loopingSpriteArray = leftWalkSprites;
            }
        } else if (checkKey.right) {
            if (onBack) {
                loopingSpriteArray = rightWalkPackSprites;
            } else {
                loopingSpriteArray = rightWalkSprites;
            }
        }
        if (spriteTime >= 0) {
            spriteTime--;

        } else {
            spriteNum++;
            spriteTime = 3;
            if (spriteNum > 6) {
                spriteNum = 0;
            }
        }
    }
    astronaut.img = loopingSpriteArray[spriteNum];
    astronaut.src = loopingSpriteArray[spriteNum];
    astronaut.img.src = loopingSpriteArray[spriteNum].src;
}*/