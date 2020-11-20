// create main objects to interact
const controller = new Controller();
let game = new Game();
let display = new Display();

// MAIN CODE
function onLoad() {
    // run code
    initialize();
    setInterval(update, 20); // call update every frame
}


// run code
initialize();
setInterval(update, 20); // call update every frame

// DEFINE CODE
function initialize() {
    display.initialize();
}

function update() {
    console.log("updating");
    // receive input from Controller
    controller.update();
    
    // use input from Controller to update game logic in Game (i.e. mathematically, where is the player?)
    game.update(controller.input.upKeyDown, controller.input.leftKeyDown, controller.input.rightKeyDown);

    // use input from Game to draw the screen with Display
    display.update(game.player.xPosition, game.player.yPosition);
}


const Controller = function() {
    function update() {
        document.onkeydown = checkKey;
        document.onkeyup = checkKey;
    }

    function checkKey(event) {
        event = event || window.event;
        let key_state = (event.type == "keydown") ? true : false;
        switch(event.keyCode) {
            case 37:// left key
                input.leftKeyDown = key_state;
                break;
            case 38:// up key
                input.upKeyDown = key_state;
                break;
            case 39:// right key
                input.rightKeyDown = key_state;
                break;
        }
    }

    let input = {
        // key states
        upKeyDown: false,
        leftKeyDown: false,
        rightKeyDown: false
    }
}


const Game = function() {
    //update the coordinates of the player (and any other moving objects)
    function update(upKeyDown, leftKeyDown, rightKeyDown) {
        // UPDATE FORCES ON PLAYER (player.downForce, upForce, leftForce, and rightForce)
        // if falling
        if (player.yPosition < floor) {
            player.downForce += world.gravity;
        }
        // if beginning a jump
        if (upKeyDown && !player.isJumping) {
            player.upForce += jumpForce;
        }
        // if colliding with the ground
        if (player.yPosition >= world.floorYPosition) {
            player.downForce = 0;
            player.upforce = 0;
            player.yPosition = world.floorYPosition;
        }

        // apply gravity and jumpforce to player y-coords
        player.yPosition += player.downForce - player.upForce;

        // update x coords

        // if pressing leftKey and able to move left, update coords to move left
        // if pressing rightKey and able to move right, update coords to move right
        // if in the air, update coords to apply gravity
    }

    let world = {
        //constant values
        gravity: 10,
        floorYPosition: 540,
    }

    let player = {
        // constant values
        jumpForce: 50,

        // jumping state
        isJumping: false,

        // coords (to update and give to Display)
        xPosition: 200,
        yPosition: 200,
        
        // forces felt by player
        downForce: 0,
        upForce: 0
    }
}

const Display = function(playerXPosition, playerYPosition) {
    //variables
    let canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 900;
    let context = canvas.getContext("2d");

    // create html player context (did I do this right?)
    let playerContext = canvas.getContext("2d");
    playerContext.fillStyle = player.color;
    
    function initialize() {
        // insert HTML canvas
        document.body.insertBefore(canvas, document.body.childNodes[0]);
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw environment(just canvas right now)

        // draw character
        player
        context.fillRect(player.xPosition, player.yPosition, player.width, player.height);  
    }

    // player information
    let player = {
        xPosition: 200,
        yPosition: 200,
        height: 100,
        width: 100,
        color: "orange"
    }
}

/*
Explanation of this code:
    Split into 3 (maybe 4) classes: Controller, Game, and Display
    Main code block:
        This is where I 
            1) create a Controller object, a Game object, and a Display object, 
            2) call the update function each frame on each of these objects
        This is where my classes interact, since the output of my Controller object is the input of my Game object,
            and the output of my Game object the input of my Display object
        Come back to this later...
    Controller:
        The update function checks for user input and outputs it.
    Game:
        The Game object keeps track of all the logic going on in the game (i.e., mathematically, what forces are
            acting on the player right now? What should the player's coordinates be?);
        The update function uses user input (interpreted by the Controller object) to update the forces acting on
            the player, and then it uses those forces to compute the updated coordinates of the player, which are
            outputted for use by the Display object.
    Display:
        The update function takes the player's updated coordinates from the Game object and uses them to draw
            the player at the correct position.
*/

/*
Questions:
How do you get key input?
*/
