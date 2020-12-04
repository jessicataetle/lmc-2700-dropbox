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
    //@matthew I think the best way to do this is make animation functions that change the source of the image and call them here - also astronaut animation can be based on velocity (ex: negative velX means astronaut is going left). Also you can change the src of an image by doing: {variable name}.src = {new source}
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
    onBack = true;
    dropBox = false;
    jumping = false;
    levelGroundImage = createImage("./ground-tiles/texture-moon02.png");
    portalImage = createImage("./portal.png");
    initNewLevel(level1Plan)
    portal = new componentFromImage(75, 125, canvasWidth - 75, canvasHeight - 175, portalImage)
    myGameArea.clear();
    drawLevels();
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
    powerUpImage = createImage("powerup.png")
    levelGroundImage = createImage("./ground-tiles/2.png");
    level2GroundImage = createImage("./ground-tiles/Lvl-02-tile.png")
    initNewLevel(level2Plan);
    portal = new componentFromImage(75, 125, 0, 25, portalImage)
    myGameArea.clear();
    drawLevels();
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
    levelGroundImage = createImage("./ground-tiles/texture-moon01.png")
    initNewLevel3(level3Plan);
    portal = new componentFromImage(45, 75, canvasWidth - 45, canvasHeight - 105, portalImage)
    myGameArea.clear();
    drawLevels();
    portal.draw();
    astronaut.draw();
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