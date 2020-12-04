var portalSpriteNum = 1;
var portalSpriteTime = 5;
var portalColor = "red";
var astroSpriteTime = 10;
var astroSpriteNum = 0;
var astroSpriteDirection = "right";
var packText = "-pack";
var stateText = "walk-";
var jumpFrameStack = 0;
primeImages();
const state = {
    MENU: 'menu',
    GAME: 'game',
    END: 'end',
}
var level1 = true;
var level2 = false;
var level3 = false;
var level1Background;
var level2Background;
var level3Background;
var startScreenImages = [];
var endScreenImages = [];
var endscreen;
var startscreen;
var endScreenCount = 0
var startscreenCount = 0;

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
                this.interval = setInterval(start, 40)
                break;
            case 'end':
                this.interval = setInterval(end, 40)
                break;
        }
    }
}

//start screen
function onLoad() {
    myGameArea.setup();
    stateMachine.stateMachine(state.MENU, false)
    document.addEventListener('click',  goToLevel1, { once: true })
    level1Background = createImage("GameDesign_LVL01_4k.png")
    level2Background = createImage("Lvl-02-background.png")
    level3Background = createImage("Lvl-03-background.png")
    levelGroundImage = createImage("./ground-tiles/texture-moon02.png");
    for(var i = 1; i < 66; i++) {
        if (i < 10) {
            startScreenImages.push(createImage("./startscreen/StartScreen_adjusted200" + i + ".png"))
        } else {
            startScreenImages.push(createImage("./startscreen/StartScreen_adjusted20" + i + ".png"))
        }
    }
    createEndScreenImages()
}

//start loop
function start() {
    if(startscreenCount < startScreenImages.length - 1) {
        document.body.style.backgroundImage = "url(" + startScreenImages[startscreenCount].src + ")"
        startscreenCount++;
    } else {
        startscreenCount = 0;
    }
}

//start -> game
function goToLevel1() {
    document.body.style.backgroundImage = "url(" + level1Background.src + ")"
    stateMachine.stateMachine(state.GAME, true)
    var audio = new Audio("./audio/DropBox\ Rough.mp3")
    audio.loop = true;
    audio.play();
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
    updatePortalImageLoop();
    updateAstronautImage();
    if(collision(astronaut.x, astronaut.y, astronaut.width, astronaut.height, portal.x, portal.y, portal.width, portal.height)) {
        if(level1) {
            document.body.style.backgroundImage = "url(" + level2Background.src + ")"
            initLevel2();
        }else if (level2) {
            document.body.style.backgroundImage = "url(" + level3Background.src + ")"
            initLevel3();
        } else if (level3) {
            stateMachine.stateMachine(state.END, true)
        }
    }
    myGameArea.clear();
    drawLevels();
    drawPowerUps();
    if (dropBox) {
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
}

function end() {
    myGameArea.clear();
    if(endScreenCount < endScreenImages.length - 1) {
        document.body.style.backgroundImage = "url(" + endScreenImages[endScreenCount].src + ")"
        endScreenCount++;
    } else {
        endScreenCount = 0;
    }
}
 
//initializes game
function initLevel1() {
    primeImages();
    onBack = true;
    dropBox = false;
    jumping = false;
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, new Image(), "./images/portal/red/001.png")
    initNewLevel(level1Plan)
    myGameArea.clear();
    drawLevels();
    astronaut.draw();
    portal.draw();
}

function initLevel2() {
    primeImages();
    onBack = true;
    dropBox = false;
    jumping = false;
    level1 = false;
    level2 = true;
    activePowerup = false;
    portalColor = "green";
    portal = new componentI(75, 125, 0, 25, new Image(), "./images/portal/green/001.png")
    powerUpImage = createImage("powerup.png")
    levelGroundImage = createImage("./ground-tiles/2.png");
    level2GroundImage = createImage("./ground-tiles/Lvl-02-tile.png")
    initNewLevel(level2Plan);
    myGameArea.clear();
    drawLevels();
    portal.draw();
    astronaut.draw();
}

function initLevel3() {
    primeImages();
    onBack = true;
    dropBox = false;
    jumping = false;
    level2 = false;
    level3 = true;
    activePowerup = false;
    levelGroundImage = createImage("./ground-tiles/texture-moon01.png")
    initNewLevel3(level3Plan);
    portalColor = "blue";
    portal = new componentI(45, 75, canvasWidth - 45, canvasHeight - 105, new Image(), "./images/portal/blue/001.png")
    myGameArea.clear();
    drawLevels();
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
}

function updatePortalImageLoop() {
    portalSpriteTime--;
    if (portalSpriteTime < 0) {
        portalSpriteNum++;
        if (portalSpriteNum > 4) {
            portalSpriteNum = 1;
        }
        portalSpriteTime = 10;
    }
    portal.img.src = "images/portal/" + portalColor + "/00" + portalSpriteNum + ".png";
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
    for (var i = 0; i < 4; i++) {
        image = new Image();
        image.src = "images/portal/" + portalColor + "/00" + (i + 1) + ".png";
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

function createEndScreenImages() {
    for(var i = 0; i < 518; i++) {
        if (i < 10) {
            endScreenImages.push(createImage("./endscreen/EndScreen00" + i + ".png"))
        } else if ( i < 100) {
            endScreenImages.push(createImage("./endscreen/EndScreen0" + i + ".png"))
        } else {
            endScreenImages.push(createImage("./endscreen/EndScreen" + i + ".png"))
        }
    }
}