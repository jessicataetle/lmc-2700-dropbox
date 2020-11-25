//2261

//variables
let canvas;
let context;

let initialXPos = 200;
let initialYPos = 200;

let screenHeight = 500;
let screenWidth = 600;

function onLoad() {
    init();
    setInterval(update, 20); // call update every frame
}

function init() {
    display.init();
}

function update() {
    // receive input from Controller
    controller.update();
    
    // use input from Controller to update game logic in Game (i.e. mathematically, where is the player?)
    game.update(controller.input.upKeyDown, controller.input.leftKeyDown, controller.input.rightKeyDown);

    // use input from Game to draw the screen with Display
    display.update(game.player.xPosition, game.player.yPosition);
}

let controller = {
    update: function() {
        document.onkeydown = this.checkKey;
        document.onkeyup = this.checkKey;
    },
    checkKey: function(event) {
        event = event || window.event;
        let key_state = (event.type == "keydown") ? true : false;
        switch(event.keyCode) {
            case 37:// left key
                controller.input.leftKeyDown = key_state;
                break;
            case 38:// up key
                controller.input.upKeyDown = key_state;
                break;
            case 39:// right key
                controller.input.rightKeyDown = key_state;
                break;
        }
    },
    input: {
        // key states
        upKeyDown: false,
        leftKeyDown: false,
        rightKeyDown: false
    }
}

let game = {
    //update the coordinates of the player (and any other moving objects)
    update: function (upKeyDown, leftKeyDown, rightKeyDown) {
        // UPDATE FORCES ON PLAYER (player.downForce, upForce, leftForce, and rightForce)
        // if falling
        if (game.player.yPosition < game.world.floorYPosition) {
            game.player.isJumping = true;
            game.player.downForce += game.world.gravity;
        }
        // if colliding with the ground
        if (game.player.yPosition >= game.world.floorYPosition - game.player.height) {
            game.player.isJumping = false;
            game.player.downForce = 0;
            game.player.upforce = 0;
            game.player.yPosition = game.world.floorYPosition - game.player.height;
        }
        // if beginning a jump
        if (upKeyDown && !game.player.isJumping) {
            game.player.isJumping = true;
            game.player.upForce += game.player.jumpForce;

        }

        // apply gravity and jumpforce to player y-coords
        game.player.yPosition += game.player.downForce - game.player.upForce;

        // update x coords

    },

    world: {
        //constant values
        gravity: .5,
        floorYPosition: screenHeight,
    },

    player: {
        // coords (to update and give to Display)
        xPosition: initialXPos,
        yPosition: initialYPos,

        // constant values
        jumpForce: 10,

        // player dimensions
        width: 100,
        height: 100,

        // jumping state
        isJumping: false,
        
        // forces felt by player
        downForce: 0,
        upForce: 0
    }
}

let display = {
    init: function() {
        canvas = document.createElement("canvas");
        canvas.width = screenWidth;
        canvas.height = screenHeight;
        context = canvas.getContext("2d");
        // insert HTML canvas
        document.body.insertBefore(canvas, document.body.childNodes[0]);
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);

        display.player.yPosition = initialYPos;
        display.player.xPosition = initialXPos;
    },

    update: function(playerXPosition, playerYPosition) {
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw environment(just canvas right now)
 
        // draw character

        context.fillRect(playerXPosition, playerYPosition, display.player.width, display.player.height);  
    },

    // player information
    player: {
        height: 100,
        width: 100
    }
}