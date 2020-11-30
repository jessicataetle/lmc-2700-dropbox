function component(width, height, color, x, y, isActive) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.isActive = isActive;
    this.draw = function() {
        ctx = myGameArea.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}

//@matthew everything else image function
function componentI(width, height, x, y, img, src) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.img = img;
    this.src = src;
    this.img.src = this.src;
    this.draw = function() {
        ctx = myGameArea.context;   
        ctx.drawImage(img, this.x, this.y, this.width, this.height);  
    }
}

function Astronaut(width, height, x, y, img, src) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.velX = 1;
    this.velY = 15;
    this.img = img;
    this.src = src;
    this.img.src = this.src;
    this.draw = function() {
        ctx = myGameArea.context;
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }
}

function collision(objX, objY, objWidth, objHeight, otherObjX, otherObjY, otherObjWidth, otherObjHeight) { 
    var myleft = objX;
    var myright = objX + objWidth;
    var mytop = objY;
    var mybottom = objY + objHeight;
    var otherleft = otherObjX;
    var otherright = otherObjX + otherObjWidth;
    var othertop = otherObjY;
    var otherbottom = otherObjY + otherObjHeight;
    return mytop < otherbottom - 1 && mybottom - 1 > othertop && myleft < otherright - 1 && myright - 1 > otherleft;
}

function genericCollision(posA, posB, lenA, lenB)   {
    if ((posA + lenA) - 1 > posB && posA < (posB + lenB) - 1) {
        return true
    } else {
        return false
    }
}

//jump / gravity function
function jump() {
    var stop = false;
    for(var i = 0; i < level.length; i++) {
        if(genericCollision(astronaut.y + (velY + 1), level[i].y, astronaut.height, level[i].height) && genericCollision(astronaut.x, level[i].x, astronaut.width, level[i].width)) {
            level[i].isActive = true;
            if (astronaut.y < level[i].y) {
                stop = true;
                if(!onBack) {
                    astronaut.y = level[i].y - astronaut.height;
                } else {
                    astronaut.y = level[i].y - astronaut.height;
                }   
            } else {
                if (!collision(astronaut.x, astronaut.y, astronaut.width, astronaut.height, level[i].x, level[i].y, level[i].width, level[i].height)) {
                    velY = -1;
                } else {
                    stop = true;
                }
            }
        }
    }
    
    if (stop) {
        jumping = false;
        velY = 0;
    } else {
        astronaut.y += velY;
        velY += 1;
    }
}