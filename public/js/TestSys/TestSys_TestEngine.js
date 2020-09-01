/* Simple Adventure Game Engine
 * All the most basic game mechanics required to run a Game State.
 */

var keysDown;
var animate;
var stopAnimating;
var stateMachine;
var canvas;
var gameWindow;
var player;
var levels_xml;
var levels;
var levelNumber;
var context;

// current level info
var currentLevel;
var currentLevelWalls;
var currentLevelDoors;
var currentLevelItems;
var currentLevelRndEncounterEngine;

var fi;
var dm;

var directions;

var owHeight = 600;
var owWidth = 820;

// timing
var start;
var lastTick;
var deltaTime;

var testGrid;

function load()
{
	canvas = document.createElement('canvas');
    gameWindow = document.createElement('section');
	gameWindow.appendChild(canvas);
	
	document.getElementsByTagName('body')[0].appendChild(gameWindow);

	/* FOR TESTING PURPOSES */
	animate = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };
	stopAnimating = false;
    keysDown = [];
    start = Date.now();
    lastTick = start;
    testGrid = new Grid(2, 2, 10, 10, 1, 1);
    context = canvas.getContext('2d');
    animate(step);
}

var step = function(){
	if(!stopAnimating) {
		update();
        render();
        let currentTick = Date.now();
        deltaTime = currentTick - lastTick;
        lastTick = currentTick;
		animate(step);
	}
}

var update = function() {

}

var render = function() {
    testGrid.render();
}

window.addEventListener("keydown", function(event){
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
	delete keysDown[event.keyCode];
});

document.addEventListener("DOMContentLoaded", load, false);