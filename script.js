var portalSpriteNum = 1;
var portalSpriteTime = 3;
var astroSpriteTime = 3;
var astroSpriteNum = 0;
var astroSpriteDirection = "right";
var packText = "-pack";
var stateText = "walk-";
var jumpFrameStack = 0;
primeImages();

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
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, img, "./images/portal/1.png")
    initNewLevel(level1Plan)
    updatePortalImageLoop();
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
    stateText = "walk-";
    if (onBack) {
        packText = "-pack";
    } else {
        packText = "";
    }
    if (!checkKey.left && !checkKey.right && ! checkKey.up) {
        astroSpriteNum = 1;
    } else if (checkKey.left || checkKey.right) {// execute walking left thing
        if (checkKey.left) {
            astroSpriteDirection = "left";
        } else {
            astroSpriteDirection = "right";
        }
        if (astroSpriteTime >= 0) {
            astroSpriteTime--;
        } else {
            astroSpriteNum++;
            astroSpriteTime = 3;
            if (astroSpriteNum > 9) {
                astroSpriteNum = 1;
            }
        }
    }
    if (jumping) {
        jumpFrameStack++;
        if (jumpFrameStack > 2) {
            stateText = "jump-"
            astroSpriteNum = 1;
        }
    } else {
        jumpFrameStack = 0;
    }

    astronaut.img.src = "images/astronaut/" + stateText + astroSpriteDirection + packText + "/" + astroSpriteNum + ".png";
    console.log(astroSpriteNum);
    // astronaut.img.src = "images/astronaut/walk-right-pack/smaller-01.png";
}

function updatePortalImageLoop() {
    if (portalSpriteTime < 0) {
        portalSpriteNum++;
        if (portalSpriteNum > 1) {
            portalSpriteNum = 1;
        }
        portalSpriteTime = 3;
    } else {
        portalSpriteTime--;
    }
}

function primeImages() {
    var image;
    for (var i = 0; i < 9; i++) {
        image = new Image();
        image.src = "images/astronaut/walk-left/" + (i + 1) + ".png";
    }
    for (var i = 0; i < 9; i++) {
        image = new Image();
        image.src = "images/astronaut/walk-right/" + (i + 1) + ".png";
    }
    for (var i = 0; i < 9; i++) {
        image = new Image();
        image.src = "images/astronaut/walk-left-pack/" + (i + 1) + ".png";
    }
    for (var i = 0; i < 9; i++) {
        image = new Image();
        image.src = "images/astronaut/walk-right-pack/" + (i + 1) + ".png";
    }
    image = new Image();
    image.src = "images/astronaut/jump-left/1.png";
    image = new Image();
    image.src = "images/astronaut/jump-right/1.png";
    image = new Image();
    image.src = "images/astronaut/jump-left-pack/1.png";
    image = new Image();
    image.src = "images/astronaut/jump-right-pack/1.png";
}