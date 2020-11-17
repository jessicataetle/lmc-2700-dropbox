// MAIN CODE
// create html canvas
let canvas = document.createElement("canvas");
document.body.insertBefore(canvas, document.body.childNodes[0]);

let controller = new Controller();
let game = new Game();
let display = new Display(document.querySelector("canvas"));

function update() {
    // receive input from Controller
    controller.update();
    
    // use input from Controller to update game logic in Game (i.e. mathematically, where is the player?)
    game.update(Input.upKeyDown, Input.leftKeyDown, Input.rightKeyDown);

    // use input from Game to draw the screen with Display
    display.update(game.Player.xPosition, game.Player.yPosition);
}


const Controller = function() {
    function update() {
        Input.upKeyDown = checkUpKeyDown();
        Input.leftKeyDown = checkLeftKeyDown();
        Input.rightKeyDown = checkRightKeyDown();
    }

    // if pressing upKey, return true
    function checkUpKeyDown() {
        return KEYINPUT?? == 38; // how do you get the key input?
    }

    // if pressing leftKey, return true
    function checkLeftKeyDown() {
        return KEYINPUT?? == 37; // how do you get the key input?
    }

    // if pressing rightKey, tell Game
    function checkRightKeyDown() {
        return KEYINPUT?? == 39; // how do you get the key input?
    }

    let Input = {
        // key states
        upKeyDown: false,
        leftKeyDown: false,
        rightKeyDown: false
    }
}

const Game = function() {
    let World = {
        //constant values
        gravity,
        floorYPosition,
    }

    let Player = {
        // constant values
        jumpForce,

        // jumping state
        isJumping,

        // coords (to update and give to Display)
        xPosition,
        yPosition,
        
        // forces felt by player
        downForce,
        upForce
    }

    //update the coordinates of the player (and any other moving objects)
    function update(upKeyDown, leftKeyDown, rightKeyDown) {
        // UPDATE FORCES ON PLAYER (Player.downForce, upForce, leftForce, and rightForce)
        // if falling
        if (Player.yPosition < floor) {
            World.downForce += World.gravity;
        }
        // if beginning a jump
        if (upKeyDown && !Player.isJumping) {
            Player.upForce += jumpForce;
        }
        // if colliding with the ground
        if (Player.yPosition >= World.floorYPosition) {
            Player.downForce = 0;
            Player.upforce = 0;
            Player.yPosition = World.floorYPosition;
        }

        // apply gravity and jumpforce to Player y-coords
        Player.yPosition += Player.downForce - Player.upForce;

        // update x coords

        // if pressing leftKey and able to move left, update coords to move left
        // if pressing rightKey and able to move right, update coords to move right
        // if in the air, update coords to apply gravity
    }
}

const Display = function(canvas) {
    // size canvas
    canvas.width = Canvas.width;  
    canvas.height = Canvas.height;
    context = canvas.getContext("2d");
    // create html player context (did I do this right?)
    let playerContext = canvas.getContext("2d");
    playerContext.fillStyle = Player.color;
    
    function update() {
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw environment(just canvas right now)

        // draw character
        
    }

    // player information
    let Player = {
        height,
        width,
        color
    }

    // canvas information
    let Canvas = {
        height,
        width
    }
}


/* some jumping logic
let Player = {
    x = 200,
    y = 200
}
let downForce = 0;
let upForce = 0;
let gravity = 1;

let floor = 540;
let jumpForce = 5;
let sustainJumpForce = 0;

function gravityUpdate() {
    //assign gravity
    if (Player.y < floor) {
        downforce += gravity;
    }

    //collide with ground
    if (player.y >= floor) {
        downforce = 0;
        upforce = 0;
        player.y = floor;
    }

    //assign jumping force
	if (btn(2)) and (player.y == floor) {
	    upforce = upforce + jumpforce;
	    sfx(3);
    }

	//apply gravity and jumpforce
	player.y = player.y + downforce - upforce

}

*/

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
Explain organization
Explain jumping logic
Idea: just one object for player
*/