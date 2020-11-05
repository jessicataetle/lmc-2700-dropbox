var character = document.getElementById("character");
var block = document.getElementById("block");
var counter=0;

function jump() {
    if(character.classList == "animate-jump"){return}
    character.classList.add("animate-jump");
    setTimeout(function(){
        character.classList.remove("animate-jump");
    },300);
}

function moveRight() {
    if(character.classList == "animate-move-right"){return}
    character.classList.add("animate-move-right");
    setTimeout(function(){
        character.classList.remove("animate-move-right");
    },300);
}