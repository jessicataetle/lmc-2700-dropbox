const state = {
    MENU: 'menu',
    GAME: 'game',
}
var level1 = true;
var level2 = false;
var level3 = false;
var level2Background;
var level3Background;

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
    myGameArea.canvas.addEventListener('click',  goToLevel1, { once: true })
    level2Background = createImage("Lvl-02-background.png")
    level3Background = createImage("Lvl-03-background.png")
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
    if(collision(astronaut.x, astronaut.y, astronaut.width, astronaut.height, portal.x, portal.y, portal.width, portal.height)) {
        if(level1) {
            document.body.style.backgroundImage = "url(" + level2Background.src + ")"
            initLevel2();
        }else if (level2) {
            document.body.style.backgroundImage = "url(" + level3Background.src + ")"
            initLevel3();
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

//initializes game
function initLevel1() {
    onBack = true;
    dropBox = false;
    jumping = false;
    levelGroundImage = createImage("./ground-tiles/texture-moon01.png");
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
    levelGroundImage = createImage("./ground-tiles/texture-moon02.png")
    initNewLevel3(level3Plan);
    portal = new componentFromImage(45, 75, canvasWidth - 45, canvasHeight - 105, portalImage)
    myGameArea.clear();
    drawLevels();
    portal.draw();
    astronaut.draw();
}