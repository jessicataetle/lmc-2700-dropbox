//import initLevel1 from './game.js'
const state = {
    MENU: 'menu',
    GAME: 'game',
}
var level1 = true;
var level2 = false;
var level3 = false;

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
    myGameArea.clear();
    document.onkeydown = checkKey.checkKey;
    document.onkeyup = checkKey.checkKey;
    if (jumping) {
        jump()
    }
    updateVelAstronaut();
    powerUpCollision();
    if (dropBox) {
        inBackpackBounds();
        backpack.draw();
    }
    //@matthew I think the best way to do this is make animation functions that change the source of the image and call them here - also astronaut animation can be based on velocity (ex: negative velX means astronaut is going left). Also you can change the src of an image by doing: {variable name}.src = {new source}
    drawLevels();
    drawPowerUps();
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
    myGameArea.clear();
    //@matthew instantiate astronaut here
    //@matthew example of instantiating here w/ portal 
    portal = new componentI(75, 125, canvasWidth - 75, canvasHeight - 175, img, "./portal.png")
    initNewLevel(level1Plan)
    astronaut.draw();
    portal.draw();
}

function initLevel2() {
    onBack = true;
    dropBox = false;
    jumping = false;
    level1 = false;
    level2 = true;
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
    myGameArea.clear();
    initNewLevel3(level3Plan);
    drawLevels();
    portal = new componentI(45, 75, canvasWidth - 45, canvasHeight - 105, img, "./portal.png")
    portal.draw();
    astronaut.draw();
}